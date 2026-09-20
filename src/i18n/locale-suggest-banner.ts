import type { Locale } from "@/lib/utils";

export interface LocaleSuggestBannerCopy {
  prompt: string;
  continue: string;
  close: string;
  selectLabel: string;
  regionLabel: string;
}

const copy: Record<Locale, LocaleSuggestBannerCopy> = {
  en: {
    prompt:
      "Choose another language to browse content adapted for your browser language preference.",
    continue: "Continue",
    close: "Close suggestion banner",
    selectLabel: "Select preferred language",
    regionLabel: "Language recommendation banner",
  },
  zh: {
    prompt: "选择另一语言以浏览适用于你浏览器语言偏好的内容。",
    continue: "继续",
    close: "关闭语言建议横幅",
    selectLabel: "选择首选语言",
    regionLabel: "语言推荐横幅",
  },
  ja: {
    prompt:
      "別の言語を選ぶと、ブラウザの言語設定に合わせたコンテンツを表示できます。",
    continue: "続ける",
    close: "言語提案バナーを閉じる",
    selectLabel: "希望の言語を選択",
    regionLabel: "言語おすすめバナー",
  },
  ko: {
    prompt:
      "다른 언어를 선택하면 브라우저 언어 설정에 맞는 콘텐츠를 볼 수 있습니다.",
    continue: "계속",
    close: "언어 제안 배너 닫기",
    selectLabel: "원하는 언어 선택",
    regionLabel: "언어 추천 배너",
  },
  es: {
    prompt:
      "Elija otro idioma para ver contenido adaptado a la preferencia de idioma de su navegador.",
    continue: "Continuar",
    close: "Cerrar banner de sugerencia de idioma",
    selectLabel: "Seleccionar idioma preferido",
    regionLabel: "Banner de recomendación de idioma",
  },
  fr: {
    prompt:
      "Choisissez une autre langue pour afficher le contenu adapté aux préférences linguistiques de votre navigateur.",
    continue: "Continuer",
    close: "Fermer la bannière de suggestion de langue",
    selectLabel: "Sélectionner la langue préférée",
    regionLabel: "Bannière de recommandation de langue",
  },
  de: {
    prompt:
      "Wählen Sie eine andere Sprache, um Inhalte entsprechend Ihrer Browser-Spracheinstellung anzuzeigen.",
    continue: "Weiter",
    close: "Sprachvorschlagsbanner schließen",
    selectLabel: "Bevorzugte Sprache auswählen",
    regionLabel: "Sprachempfehlungsbanner",
  },
};

export function getLocaleSuggestBannerCopy(locale: Locale): LocaleSuggestBannerCopy {
  return copy[locale] ?? copy.en;
}
