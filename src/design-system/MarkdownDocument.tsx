import type { ReactNode } from "react";

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g).map((part,index) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2,-2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={index}>{part.slice(1,-1)}</code>;
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (match) return /^https?:\/\//.test(match[2]) ? <a key={index} href={match[2]} target="_blank" rel="noreferrer">{match[1]}</a> : <code key={index} title={match[2]}>{match[1]}</code>;
    return part;
  });
}
export default function MarkdownDocument({ text }: { text: string }) {
  const lines = text.replaceAll('\r','').split('\n'); const blocks: ReactNode[] = [];
  for (let index=0;index<lines.length;index++) {
    const line=lines[index]; if (!line.trim()) continue;
    if(line.startsWith('```')) { const code=[];const language=line.slice(3);while(++index<lines.length&&!lines[index].startsWith('```'))code.push(lines[index]);blocks.push(<pre key={index} data-language={language}><code>{code.join('\n')}</code></pre>);continue; }
    const heading=line.match(/^(#{1,6})\s+(.+)/);
    if(heading) { const Tag=(`h${Math.min(heading[1].length+1,6)}`) as 'h2';blocks.push(<Tag key={index}>{inline(heading[2])}</Tag>);continue; }
    if(line.startsWith('|')&&lines[index+1]?.match(/^\|[\s:|\-]+\|$/)) {
      const cells=(row:string)=>row.split('|').slice(1,-1).map(cell=>cell.trim()); const headers=cells(line);const rows=[];index++;
      while(lines[index+1]?.startsWith('|'))rows.push(cells(lines[++index]));
      blocks.push(<div className="ds-markdown-table" key={index}><table><thead><tr>{headers.map((cell,i)=><th key={i}>{inline(cell)}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{inline(cell)}</td>)}</tr>)}</tbody></table></div>);continue;
    }
    if(/^\s*[-*]\s+/.test(line)){const items=[line.replace(/^\s*[-*]\s+/,'')];while(/^\s*[-*]\s+/.test(lines[index+1]||''))items.push(lines[++index].replace(/^\s*[-*]\s+/,''));blocks.push(<ul key={index}>{items.map((item,i)=><li key={i}>{inline(item)}</li>)}</ul>);continue;}
    if(/^\s*\d+\.\s+/.test(line)){const items=[line.replace(/^\s*\d+\.\s+/,'')];while(/^\s*\d+\.\s+/.test(lines[index+1]||''))items.push(lines[++index].replace(/^\s*\d+\.\s+/,''));blocks.push(<ol key={index}>{items.map((item,i)=><li key={i}>{inline(item)}</li>)}</ol>);continue;}
    if(line.startsWith('>')){blocks.push(<blockquote key={index}>{inline(line.replace(/^>\s?/,''))}</blockquote>);continue;}
    if(/^[-_]{3,}$/.test(line)){blocks.push(<hr key={index}/>);continue;}
    const paragraph=[line];while(lines[index+1]?.trim()&&!/^(#|\||```|>|[-*]\s|\d+\.\s)/.test(lines[index+1]))paragraph.push(lines[++index]);
    blocks.push(<p key={index}>{inline(paragraph.join(' '))}</p>);
  }
  return <div className="ds-markdown">{blocks}</div>;
}
