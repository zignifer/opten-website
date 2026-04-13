import LegalLayout from "../components/layout/LegalLayout";
import { useT } from "../../i18n/LangContext";

export default function RefundPage() {
  const t = useT();

  return (
    <LegalLayout title={t("refund.title")} updatedAt={t("refund.updatedAt")}>
      <div dangerouslySetInnerHTML={{ __html: t("refund.body") }} />
    </LegalLayout>
  );
}
