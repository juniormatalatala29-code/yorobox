import { motion } from "framer-motion";
import {
  FileText,
  Users,
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  Image,
  Settings,
  Ban,
  Copyright,
  RefreshCcw,
  MessageCircle,
} from "lucide-react";
import "./legal-pages.css";

const sections = [
  {
    number: "01",
    title: "Description du service",
    icon: <Users size={20} />,
    content: (
      <>
        <p className="legal-text legal-mb-16">
          Yaka est une plateforme numérique qui met en relation des clients avec
          des prestataires de services dans différents domaines :
        </p>
        <ul className="legal-list">
          <li>coiffure et beauté</li>
          <li>services événementiels</li>
          <li>habillement et accessoires</li>
          <li>autres services proposés par les utilisateurs</li>
        </ul>
        <p className="legal-text legal-mt-16">
          La plateforme facilite la recherche de services, la communication et la
          mise en relation entre utilisateurs.
        </p>
      </>
    ),
  },
  {
    number: "02",
    title: "Conditions d’accès à la plateforme",
    icon: <UserCheck size={20} />,
    content: (
      <>
        <p className="legal-text legal-mb-16">
          Pour utiliser certaines fonctionnalités de Yaka, les utilisateurs doivent :
        </p>
        <ul className="legal-list">
          <li>créer un compte utilisateur</li>
          <li>fournir des informations exactes et à jour</li>
          <li>respecter les règles de la plateforme</li>
        </ul>
        <p className="legal-text legal-mt-16">
          L’utilisateur est responsable de l’exactitude des informations fournies
          lors de l’inscription.
        </p>
      </>
    ),
  },
  {
    number: "03",
    title: "Comptes utilisateurs",
    icon: <ShieldCheck size={20} />,
    content: (
      <>
        <p className="legal-text legal-mb-16">
          Pour accéder à certaines fonctionnalités de Yaka, vous devez créer un compte.
        </p>
        <ul className="legal-list">
          <li>vous êtes responsable de la confidentialité de vos identifiants</li>
          <li>vous êtes responsable de toutes les activités sur votre compte</li>
        </ul>
        <p className="legal-text legal-mt-16">
          Vous devez informer Yaka immédiatement en cas d’utilisation non autorisée
          de votre compte.
        </p>
      </>
    ),
  },
  {
    number: "04",
    title: "Utilisation de la plateforme",
    icon: <AlertTriangle size={20} />,
    content: (
      <>
        <p className="legal-text legal-mb-16">
          Les utilisateurs s’engagent à utiliser la plateforme de manière légale
          et respectueuse.
        </p>
        <p className="legal-subtitle">Il est interdit de :</p>
        <ul className="legal-list">
          <li>publier des contenus faux ou trompeurs</li>
          <li>utiliser la plateforme à des fins frauduleuses</li>
          <li>harceler ou menacer d’autres utilisateurs</li>
          <li>publier des contenus illégaux ou offensants</li>
        </ul>
        <p className="legal-text legal-mt-16">
          Toute violation de ces règles peut entraîner la suspension du compte.
        </p>
      </>
    ),
  },
  {
    number: "05",
    title: "Responsabilité de la plateforme",
    icon: <FileText size={20} />,
    content: (
      <>
        <p className="legal-text legal-mb-16">
          Yaka agit uniquement comme intermédiaire de mise en relation entre les utilisateurs.
        </p>
        <ul className="legal-list">
          <li>Yaka ne garantit pas la qualité, la sécurité ou la fiabilité des services proposés par les prestataires</li>
          <li>Yaka n’est pas responsable des accords ou transactions conclus entre utilisateurs</li>
          <li>Les utilisateurs sont responsables de leurs interactions et transactions</li>
        </ul>
      </>
    ),
  },
  {
    number: "06",
    title: "Contenu des utilisateurs",
    icon: <Image size={20} />,
    content: (
      <>
        <p className="legal-text legal-mb-16">
          Les utilisateurs peuvent publier du contenu sur la plateforme, notamment :
        </p>
        <ul className="legal-list">
          <li>photos</li>
          <li>descriptions de services</li>
          <li>informations de profil</li>
          <li>messages</li>
        </ul>
        <p className="legal-text legal-mt-16">
          En publiant du contenu sur Yaka, vous acceptez que ce contenu puisse être
          affiché publiquement sur la plateforme et que vous restez responsable de
          son exactitude et de sa légalité.
        </p>
        <p className="legal-text legal-mt-8">
          Yaka se réserve le droit de supprimer tout contenu jugé inapproprié.
        </p>
      </>
    ),
  },
  {
    number: "07",
    title: "Modification du service",
    icon: <Settings size={20} />,
    content: (
      <>
        <p className="legal-text legal-mb-16">
          Yaka se réserve le droit de :
        </p>
        <ul className="legal-list">
          <li>modifier certaines fonctionnalités</li>
          <li>améliorer la plateforme</li>
          <li>suspendre temporairement certaines parties du service</li>
        </ul>
        <p className="legal-text legal-mt-16">
          Ces modifications peuvent être effectuées avec ou sans préavis.
        </p>
      </>
    ),
  },
  {
    number: "08",
    title: "Suspension ou résiliation du compte",
    icon: <Ban size={20} />,
    content: (
      <>
        <p className="legal-text legal-mb-16">
          Yaka peut suspendre ou supprimer un compte utilisateur si :
        </p>
        <ul className="legal-list">
          <li>les conditions d’utilisation ne sont pas respectées</li>
          <li>une activité frauduleuse ou abusive est détectée</li>
          <li>le comportement de l’utilisateur nuit à la communauté</li>
        </ul>
      </>
    ),
  },
  {
    number: "09",
    title: "Propriété intellectuelle",
    icon: <Copyright size={20} />,
    content: (
      <>
        <p className="legal-text legal-mb-16">
          Tous les éléments de la plateforme Yaka, notamment :
        </p>
        <ul className="legal-list">
          <li>le nom</li>
          <li>le logo</li>
          <li>le design</li>
          <li>les textes</li>
          <li>les fonctionnalités</li>
        </ul>
        <p className="legal-text legal-mt-16">
          sont protégés par les lois sur la propriété intellectuelle. Toute reproduction
          ou utilisation non autorisée est interdite.
        </p>
      </>
    ),
  },
  {
    number: "10",
    title: "Modifications des conditions",
    icon: <RefreshCcw size={20} />,
    content: (
      <>
        <p className="legal-text legal-mb-16">
          Yaka peut modifier ces conditions d’utilisation à tout moment.
        </p>
        <p className="legal-text">
          Les utilisateurs seront informés des modifications via la plateforme.
          La date de mise à jour sera indiquée en haut de cette page.
        </p>
      </>
    ),
  },
  {
    number: "11",
    title: "Contact",
    icon: <MessageCircle size={20} />,
    content: (
      <div className="legal-text">
        <p className="legal-mb-16">
          Pour toute question concernant ces conditions d’utilisation, vous pouvez
          contacter :
        </p>
        <a
          href="https://wa.me/243977506981"
          target="_blank"
          rel="noreferrer"
          className="legal-contact-btn"
        >
          <MessageCircle size={16} />
          <span>Support Yaka</span>
        </a>
      </div>
    ),
  },
];

export default function ConditionsUtilisation() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="legal-card"
        >
          <div className="legal-card-glow" />
          <div className="legal-card-reflection" />

          <div className="legal-content">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.55 }}
              className="legal-header"
            >
              <div className="legal-badge">Conditions</div>

              <h1 className="legal-title">Conditions d’utilisation</h1>

              <p className="legal-date">Dernière mise à jour : 14 mars 2026</p>

              <p className="legal-intro">
                Bienvenue sur Yaka. Les présentes conditions d’utilisation régissent
                l’accès et l’utilisation de la plateforme Yaka. En utilisant Yaka,
                vous acceptez ces conditions. Si vous n’acceptez pas ces conditions,
                veuillez ne pas utiliser la plateforme.
              </p>
            </motion.div>

            <div className="legal-sections">
              {sections.map((section, index) => (
                <motion.section
                  key={section.number}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05, duration: 0.45 }}
                  className="legal-section-card"
                >
                  <div className="legal-section-top">
                    <div className="legal-icon-box">{section.icon}</div>

                    <div className="legal-section-heading">
                      <p className="legal-section-label">Section {section.number}</p>
                      <h2 className="legal-section-title">{section.title}</h2>
                    </div>
                  </div>

                  <div className="legal-section-body">{section.content}</div>
                </motion.section>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
