import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    nav: {
      home: "Home",
      services: "Services",
      about: "About",
      testimonials: "Testimonials",
      booking: "Book Now",
      contact: "Contact",
      admin: "Admin",
      portal: "Client Portal",
    },
    hero: {
      tagline: "The Art of Restoration",
      subtitle: "Premium cleaning & property care on Oʻahu",
      description: "Reliable, detailed service for condos and homes — from regular cleanings to move-in/move-out deep cleans and check-ins while you're away.",
      cta: "Request a Free Estimate",
      callCta: "Call (808) 227-7729",
      badge1: "Oʻahu Service",
      badge2: "Detail-Focused",
      badge3: "Fast Response",
    },
    about: {
      title: "The Pulumi Story",
      subtitle: "A Legacy of Care",
      p1: "Founded by Shoko Yamashita, Pulumi Hawaii was born from a simple belief: every home deserves the same meticulous attention you'd give your own.",
      p2: "With roots in Japanese hospitality and a deep love for Hawaiʻi, Shoko brings a unique perspective to property care — where precision meets aloha spirit.",
      p3: "As Managing Member of Pulumi Hawaii, LLC, Shoko personally oversees every service to ensure the highest standards of quality and care.",
      role: "Managing Member",
    },
    services: {
      title: "Our Services",
      subtitle: "Straightforward service options — we'll tailor the details to your home and schedule.",
      regular: {
        title: "Regular Cleaning",
        desc: "Scheduled care that keeps your home consistently fresh and tidy. Customized routines for your space.",
        includes: ["Dusting & surface cleaning", "Vacuuming & mopping", "Kitchen & bathroom sanitizing", "Bed making & tidying", "Trash removal"],
      },
      deep: {
        title: "Deep Cleaning",
        desc: "Move-in / move-out cleans with extra attention to high-impact areas. Thorough and transformative.",
        includes: ["All regular cleaning tasks", "Inside appliance cleaning", "Baseboards & light fixtures", "Window sill detailing", "Cabinet interior wipe-down"],
      },
      inspection: {
        title: "Inspection & Check-Ins",
        desc: "Simple property checks, light care services, and peace-of-mind updates for off-island owners.",
        includes: ["Property walkthrough", "Photo documentation", "Issue identification", "Light maintenance coordination", "Owner status report"],
      },
      care: {
        title: "Care Services",
        desc: "Flexible help tailored to your home's needs — ask and we'll coordinate.",
        includes: ["Lanai refresh", "Interior window polish", "Refrigerator deep clean", "Balcony care", "Custom requests welcome"],
      },
      whatsIncluded: "What's Included",
    },
    addons: {
      title: "Special Add-Ons",
      subtitle: "Enhance your service",
      items: ["Lanai Refresh", "Interior Window Polish", "Refrigerator Deep Clean", "Balcony Care", "Oven Cleaning", "Laundry Service"],
    },
    testimonials: {
      title: "What Our Clients Say",
      subtitle: "Trusted by homeowners across Oʻahu",
    },
    transformation: {
      title: "The Pulumi Standard",
      subtitle: "See the transformation",
      before: "Before",
      after: "After",
    },
    booking: {
      title: "Book Your Service",
      subtitle: "Schedule your cleaning in just a few steps",
      step1: "Select Service",
      step2: "Choose Date & Time",
      step3: "Your Details",
      step4: "Confirmation",
      selectService: "What service do you need?",
      selectAddons: "Would you like any add-ons?",
      selectDate: "Choose your preferred date",
      selectTime: "Choose your preferred time",
      yourDetails: "Tell us about your property",
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      address: "Property Address",
      propertyType: "Property Type",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      notes: "Special Instructions",
      submit: "Request Booking",
      success: "Thank you! We'll confirm your booking shortly.",
      condo: "Condo",
      house: "House",
      vacationRental: "Vacation Rental",
      other: "Other",
    },
    contact: {
      title: "Contact",
      subtitle: "Free estimates — please feel free to contact us.",
      email: "Email",
      phone: "Phone",
      address: "Address",
      addressValue: "988 Halekauwila St, #1110, Honolulu, HI 96814",
      requestEstimate: "Request a Free Estimate",
    },
    footer: {
      tagline: "Property Maintenance Services",
      description: "Cleaning, scheduled maintenance, move-in/move-out cleaning, and property check services.",
      pricing: "Free estimates — please contact us anytime.",
      rights: "© 2026 Pulumi Hawaii, LLC. All Rights Reserved.",
      quickLinks: "Quick Links",
      getInTouch: "Get In Touch",
    },
    promise: {
      title: "The Pulumi Promise",
      items: ["Meticulous attention to detail", "Respectful of your space", "Consistent quality every visit", "Open & honest communication"],
    },
  },
  ja: {
    nav: {
      home: "ホーム",
      services: "サービス",
      about: "私たちについて",
      testimonials: "お客様の声",
      booking: "ご予約",
      contact: "お問い合わせ",
      admin: "管理画面",
      portal: "クライアントポータル",
    },
    hero: {
      tagline: "清潔の美学",
      subtitle: "オアフ島のプレミアムクリーニング＆プロパティケア",
      description: "コンドミニアムや一戸建ての定期清掃から、入退去時のディープクリーニング、不在時のチェックインまで、信頼できる丁寧なサービスをお届けします。",
      cta: "無料見積もりを依頼する",
      callCta: "(808) 227-7729",
      badge1: "オアフ島対応",
      badge2: "細部へのこだわり",
      badge3: "迅速な対応",
    },
    about: {
      title: "プルミの物語",
      subtitle: "思いやりの伝統",
      p1: "プルミハワイは、山下翔子によって設立されました。すべての家は、自分の家と同じように丁寧に扱われるべきという信念から生まれました。",
      p2: "日本のおもてなしの心とハワイへの深い愛情を持つ翔子は、精密さとアロハスピリットが融合したユニークな視点でプロパティケアを提供します。",
      p3: "プルミハワイLLCのマネージングメンバーとして、翔子はすべてのサービスを個人的に監督し、最高品質のケアを保証します。",
      role: "マネージングメンバー",
    },
    services: {
      title: "サービス内容",
      subtitle: "シンプルなサービスオプション — お住まいとスケジュールに合わせて詳細をカスタマイズいたします。",
      regular: {
        title: "定期清掃",
        desc: "お住まいを常に清潔で快適に保つスケジュール型ケアです。",
        includes: ["ほこり取り・表面清掃", "掃除機がけ・モップがけ", "キッチン・バスルーム除菌", "ベッドメイキング・整理整頓", "ゴミ回収"],
      },
      deep: {
        title: "ディープクリーニング",
        desc: "入退去時の徹底清掃。重要なエリアに特別な注意を払います。",
        includes: ["定期清掃の全項目", "家電内部の清掃", "巾木・照明器具", "窓枠の詳細清掃", "キャビネット内部の拭き取り"],
      },
      inspection: {
        title: "点検・チェックイン",
        desc: "簡易プロパティチェック、軽作業サービス、安心のための状況報告。",
        includes: ["物件のウォークスルー", "写真記録", "問題の特定", "軽いメンテナンス調整", "オーナーへのステータス報告"],
      },
      care: {
        title: "ケアサービス",
        desc: "お住まいのニーズに合わせた柔軟なサポート。ご相談ください。",
        includes: ["ラナイのリフレッシュ", "内窓の磨き上げ", "冷蔵庫のディープクリーン", "バルコニーケア", "カスタムリクエスト歓迎"],
      },
      whatsIncluded: "含まれるサービス",
    },
    addons: {
      title: "特別オプション",
      subtitle: "サービスをさらに充実",
      items: ["ラナイリフレッシュ", "内窓ポリッシュ", "冷蔵庫ディープクリーン", "バルコニーケア", "オーブンクリーニング", "ランドリーサービス"],
    },
    testimonials: {
      title: "お客様の声",
      subtitle: "オアフ島のお客様に信頼されています",
    },
    transformation: {
      title: "プルミスタンダード",
      subtitle: "変化をご覧ください",
      before: "ビフォー",
      after: "アフター",
    },
    booking: {
      title: "ご予約",
      subtitle: "簡単なステップでクリーニングをスケジュール",
      step1: "サービス選択",
      step2: "日時選択",
      step3: "お客様情報",
      step4: "確認",
      selectService: "どのサービスが必要ですか？",
      selectAddons: "追加オプションはいかがですか？",
      selectDate: "ご希望の日付を選択",
      selectTime: "ご希望の時間帯を選択",
      yourDetails: "物件について教えてください",
      name: "お名前",
      email: "メールアドレス",
      phone: "電話番号",
      address: "物件住所",
      propertyType: "物件タイプ",
      bedrooms: "寝室数",
      bathrooms: "バスルーム数",
      notes: "特別なご要望",
      submit: "予約を申し込む",
      success: "ありがとうございます！ まもなく予約を確認いたします。",
      condo: "コンドミニアム",
      house: "一戸建て",
      vacationRental: "バケーションレンタル",
      other: "その他",
    },
    contact: {
      title: "お問い合わせ",
      subtitle: "無料見積もり — お気軽にご連絡ください。",
      email: "メール",
      phone: "電話",
      address: "住所",
      addressValue: "988 Halekauwila St, #1110, Honolulu, HI 96814",
      requestEstimate: "無料見積もりを依頼する",
    },
    footer: {
      tagline: "プロパティメンテナンスサービス",
      description: "クリーニング、定期メンテナンス、入退去時清掃、物件チェックサービス。",
      pricing: "無料見積もり — いつでもお気軽にお問い合わせください。",
      rights: "© 2026 Pulumi Hawaii, LLC. All Rights Reserved.",
      quickLinks: "クイックリンク",
      getInTouch: "お問い合わせ",
    },
    promise: {
      title: "プルミの約束",
      items: ["細部への徹底的なこだわり", "お客様のスペースへの敬意", "毎回変わらない品質", "オープンで誠実なコミュニケーション"],
    },
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('pulumi-lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('pulumi-lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (path) => {
    const keys = path.split('.');
    let value = translations[lang];
    for (const key of keys) {
      value = value?.[key];
    }
    return value || path;
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'ja' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}