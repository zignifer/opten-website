import LegalLayout from "../components/layout/LegalLayout";
import { useT } from "../../i18n/LangContext";

export default function TermsPage() {
  const t = useT();

  return (
    <LegalLayout title={t("terms.title")} updatedAt={t("terms.updatedAt")}>
      <div dangerouslySetInnerHTML={{ __html: t("terms.body") }} />
    </LegalLayout>
  );
}
