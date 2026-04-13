import LegalLayout from "../components/layout/LegalLayout";
import { useT } from "../../i18n/LangContext";

export default function PrivacyPage() {
  const t = useT();

  return (
    <LegalLayout title={t("privacy.pageTitle")} updatedAt={t("privacy.updatedAt")}>
      <div dangerouslySetInnerHTML={{ __html: t("privacy.body") }} />
    </LegalLayout>
  );
}
