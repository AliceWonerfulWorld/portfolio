
import nesupaniImage from '../assets/nesupani.png';
import quizmasterImage from '../assets/quizmaster.png';
import nisettiImage from '../assets/nisetti.png';
import animeishiImage from '../assets/Animeishi.png';
import sikapokeImage from '../assets/sikapoke2.png';
import seitouImage from '../assets/oneforall.png';
import listen39Image from '../assets/Listen39.png';

export const projects = [
    {
        id: "quizmaster",
        title: "クイズマスター",
        summary: "授業で作ったアプリをブラッシュアップした、4択クイズアプリ。",
        description: "4択のシンプルなクイズアプリです。\n昔学校の授業で作ったものを自分なりにブラッシュアップしました。",
        titleImage: quizmasterImage,
        contentImage: "https://via.placeholder.com/600x400?text=Quiz+App+Screenshot",
        tags: ["Flutter"],
        link: "https://quizmasters-7aecd.web.app/",
        demoLink: "#",
        githubLink: "https://github.com/AliceWonerfulWorld/quizappFlutter"
    },
    {
        id: "nisetti2",
        title: "ニセッチ2",
        summary: "Joy-Conを使って遊べるゲームを搭載した、ゲーム機風プロダクト。",
        description: "ハックツハッカソン ギガノトカップにて作成しました。\n今話題のあのゲーム機っぽいものを作ってみました。Joy-conを使って遊べるゲームも入っています。",
        titleImage: nisettiImage,
        contentImage: "https://via.placeholder.com/600x400?text=Project+Content+2",
        tags: ["React", "GCP", "JavaScript", "Terraform"],
        link: "https://giganoto-front.pages.dev/",
        demoLink: "#",
        githubLink: "https://github.com/Yanai1005/giganoto-front",
        detailsLink: "https://topaz.dev/projects/d561c6a5ba98b6cf9f78"
    },
    {
        id: "nesugoshi-panic",
        title: "寝過ごしパニック！",
        summary: "技術縛りのある部内ハッカソンで制作。最優秀賞を受賞したチーム作品。",
        description: "部内ハッカソンにて作成しました。\n「Flutter,React,JavaScript,LineMessagingAPIを必ず使用する」という技術縛りの中開発したプロダクトだったので非常に開発が大変でした。\n部内ハッカソン 最優秀賞受賞 \n2025/07/05開催 技育博 vol3 展示",
        titleImage: nesupaniImage,
        contentImage: "https://via.placeholder.com/600x400?text=Nesupani+App+Screenshot",
        tags: ["Flutter", "Firebase", "React", "JavaScript", "LineMessagingAPI", "Unity", "MediaPipe"],
        link: "https://nesupani-react.vercel.app/",
        demoLink: "#",
        githubLink: "https://github.com/RiTa-23/NesugoshiPanic",
        detailsLink: "https://topaz.dev/projects/ca07b33b0dfd1afac98b"
    },
    {
        id: "animeishi",
        title: "アニ名刺",
        summary: "アニメの好みを名刺にしてQRコードで交換し、初対面の会話のきっかけを作るアプリ。",
        description: "2025.2.1～2.2の技育CAMPハッカソン 2024年度 Vol.21にて製作しました。\n初対面の人と会話をするときに会話のネタがない.....そんなときに役立つようなアプリを目指して作りました。\nあなただけのアニ名刺を作って、QRコードで交換しよう！",
        titleImage: animeishiImage,
        contentImage: "https://via.placeholder.com/600x400?text=Project+Content+4",
        tags: ["Flutter", "Firebase"],
        link: "https://animeishi-73560.firebaseapp.com/",
        demoLink: "#",
        githubLink: "https://github.com/KOU050223/Animeishi"
    },
    {
        id: "sikapoke",
        title: "SIKAPOKE(Sikaku mounting Card Game Pocket)",
        summary: "カードを集めて自分だけのデッキを作れる、ハッカソン制作のカードゲーム。",
        description: "2025.3.26～3.27 技育CAMPハッカソン 2025年度 vol1にて制作しました。\n今話題のあのカードゲームをオマージュして作ってみました。\nパックを引いて、カードを5枚選んで自分だけのデッキを作ろう！ \n技育CAMPハッカソン 2025年度 vol1 努力賞 受賞",
        titleImage: sikapokeImage,
        contentImage: "https://via.placeholder.com/600x400?text=Project+Content+4",
        tags: ["Flutter", "Firebase"],
        link: "https://sikapoke-42416.web.app/",
        demoLink: "https://www.youtube.com/watch?app=desktop&v=V33WS5e4fNQ&list=PLxw0gD-pIxZfvlgVJBUwSeMR5snLB64y9&index=14",
        githubLink: "https://github.com/RiTa-23/SIKAPOKE_flutter"
    },
    {
        id: "seitou",
        title: "政党まとめサイト",
        summary: "インターンシップでNotionとStudioを使って制作した政党まとめサイト。",
        description: "2023年9月 カラビナテクノロジー株式会社の2weeksインターンシップに参加した際に作成しました。\nWeb制作には、NotionとStudioという2つのノーコードツールを使用しました",
        titleImage: seitouImage,
        contentImage: "https://via.placeholder.com/600x400?text=Project+Content+4",
        tags: ["Notion", "Studio"],
        link: "https://seitou2023.studio.site/",
    },
    {
        id: "listen-with-39",
        title: "Listen With 39",
        summary: "楽曲に合わせてミクが動くMV。マジカルミライ2025プログラミング・コンテスト応募作品。",
        description: "初音ミク「マジカルミライ 2025」プログラミング・コンテスト 応募作品 \n曲に合わせてミクが動くMVを作成しました。\n使用した楽曲 「ストリートライト」\nhttps://www.youtube.com/watch?v=NPOhKU5VTrQ",
        titleImage: listen39Image,
        contentImage: "https://via.placeholder.com/600x400?text=Project+Content+4",
        tags: ["Typescript", "Babylon.js", "Blender"],
        link: "https://magimira2025-henon.pages.dev/?k=magimira39",
        githubLink: "https://github.com/henohenon/magimira2025"
    },

];
