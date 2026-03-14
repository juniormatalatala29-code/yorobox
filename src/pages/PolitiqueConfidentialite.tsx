import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Database,
  Eye,
  Cookie,
  Clock3,
  UserCheck,
  Baby,
  RefreshCcw,
  MessageCircle,
} from "lucide-react";
import "./legal-pages.css";

const sections = [
  {
    number: "01",
    title: "Informations que nous collectons",
    icon: <Database size={20} />,
    content: (
      <>
        <p className="legal-text legal-mb-16">
          Lorsque vous utilisez Yaka, certaines informations peuvent être collectées.
        </p>

        <div className="legal-mb-16">
          <h4 className="legal-subtitle">Informations que vous fournissez directement</h4>
          <ul className="legal-list">
            <li>votre nom</li>
            <li>votre adresse email</li>
            <li>votre numéro de téléphone</li>
            <li>votre photo de profil</li>
            <li>les informations de votre profil</li>
            <li>les informations liées aux services que vous publiez</li>
            <li>les photos ou vidéos que vous téléchargez</li>
          </ul>
        </div>

        <div>
          <h4 className="legal-subtitle">Informations collectées automatiquement</h4>
          <ul className="legal-list">
            <li>adresse IP</li>
            <li>type d’appareil</li>
            <li>navigateur utilisé</li>
            <li>pages visitées</li>
            <li>date et durée d’utilisation</li>
          </ul>
        </div>
      </>
    ),
  },
  {
    number: "02",
    title: "Utilisation des informations",
    icon: <Eye size={20} />,
    content: (
      <ul className="legal-list">
        <li>créer et gérer votre compte utilisateur</li>
        <li>permettre la mise en relation entre clients et prestataires</li>
        <li>faciliter les communications entre utilisateurs</li>
        <li>améliorer les fonctionnalités de la plateforme</li>
        <li>assurer la sécurité et prévenir les fraudes</li>
        <li>améliorer l’expérience utilisateur</li>
      </ul>
    ),
  },
  {
    number: "03",
    title: "Partage des informations",
    icon: <UserCheck size={20} />,
    content: (
      <>
        <p className="legal-text legal-mb-16">
          Yaka ne vend pas les informations personnelles des utilisateurs.
        </p>

        <div className="legal-stack">
          <div>
            <h4 className="legal-subtitle">Avec d&apos;autres utilisateurs</h4>
            <p className="legal-text">
              Certaines informations de votre profil peuvent être visibles par les autres
              utilisateurs afin de faciliter la mise en relation.
            </p>
          </div>

          <div>
            <h4 className="legal-subtitle">Avec des prestataires techniques</h4>
            <p className="legal-text">
              Nous pouvons utiliser des services tiers pour assurer le fonctionnement de
              la plateforme, notamment l’hébergement du site, le stockage des images et
              vidéos, et d’autres services techniques nécessaires.
            </p>
            <p className="legal-text legal-mt-8">
              Par exemple, des services comme Vercel ou Cloudinary peuvent être utilisés
              pour l’hébergement ou le stockage des médias.
            </p>
          </div>

          <div>
            <h4 className="legal-subtitle">Obligations légales</h4>
            <p className="legal-text">
              Les informations peuvent être divulguées si la loi l’exige ou si cela est
              nécessaire pour protéger les droits, la sécurité ou la propriété de Yaka et
              de ses utilisateurs.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    number: "04",
    title: "Sécurité des données",
    icon: <Lock size={20} />,
    content: (
      <>
        <p className="legal-text legal-mb-16">
          Yaka met en place des mesures de sécurité raisonnables afin de protéger les
          informations personnelles contre :
        </p>
        <ul className="legal-list legal-mb-16">
          <li>l&apos;accès non autorisé</li>
          <li>la perte de données</li>
          <li>la modification ou la divulgation non autorisée</li>
        </ul>
        <p className="legal-text">
          Cependant, aucune méthode de transmission sur Internet n’est totalement
          sécurisée.
        </p>
      </>
    ),
  },
  {
    number: "05",
    title: "Cookies et technologies similaires",
    icon: <Cookie size={20} />,
    content: (
      <>
        <p className="legal-text legal-mb-16">
          Yaka peut utiliser des cookies ou des technologies similaires afin de :
        </p>
        <ul className="legal-list legal-mb-16">
          <li>améliorer l’expérience utilisateur</li>
          <li>mémoriser certaines préférences</li>
          <li>analyser l’utilisation de la plateforme</li>
        </ul>
        <p className="legal-text">
          Les utilisateurs peuvent configurer leur navigateur pour refuser les cookies.
        </p>
      </>
    ),
  },
  {
    number: "06",
    title: "Conservation des données",
    icon: <Clock3 size={20} />,
    content: (
      <>
        <p className="legal-text legal-mb-16">
          Les informations personnelles sont conservées aussi longtemps que nécessaire
          pour :
        </p>
        <ul className="legal-list legal-mb-16">
          <li>fournir les services de la plateforme</li>
          <li>respecter les obligations légales</li>
          <li>résoudre les litiges</li>
        </ul>
        <p className="legal-text">
          Les utilisateurs peuvent demander la suppression de leur compte et de leurs
          données.
        </p>
      </>
    ),
  },
  {
    number: "07",
    title: "Droits des utilisateurs",
    icon: <ShieldCheck size={20} />,
    content: (
      <ul className="legal-list">
        <li>accéder aux informations les concernant</li>
        <li>modifier leurs informations</li>
        <li>demander la suppression de leurs données</li>
        <li>supprimer leur compte</li>
      </ul>
    ),
  },
  {
    number: "08",
    title: "Protection des mineurs",
    icon: <Baby size={20} />,
    content: (
      <p className="legal-text">
        La plateforme Yaka n’est pas destinée aux personnes âgées de moins de 18 ans.
        Nous ne collectons pas intentionnellement d’informations personnelles concernant
        des mineurs.
      </p>
    ),
  },
  {
    number: "09",
    title: "Modifications de cette politique",
    icon: <RefreshCcw size={20} />,
    content: (
      <>
        <p className="legal-text legal-mb-16">
          Yaka peut modifier cette politique de confidentialité à tout moment afin de
          refléter :
        </p>
        <ul className="legal-list legal-mb-16">
          <li>des changements techniques</li>
          <li>des évolutions légales</li>
          <li>des améliorations de la plateforme</li>
        </ul>
        <p className="legal-text">
          La date de mise à jour sera indiquée en haut de cette page.
        </p>
      </>
    ),
  },
  {
    number: "10",
    title: "Contact",
    icon: <MessageCircle size={20} />,
    content: (
      <div className="legal-text">
        <p className="legal-mb-16">
          Pour toute question concernant cette politique de confidentialité ou
          l’utilisation de vos données, vous pouvez contacter :
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

export default function PolitiqueConfidentialite() {
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
              <div className="legal-badge">Confidentialité</div>

              <h1 className="legal-title">Politique de confidentialité</h1>

              <p className="legal-date">Dernière mise à jour : 14 mars 2026</p>

              <p className="legal-intro">
                Bienvenue sur Yaka. La protection de votre vie privée est importante
                pour nous. Cette politique de confidentialité explique comment Yaka
                collecte, utilise, protège et partage vos informations lorsque vous
                utilisez notre plateforme. En utilisant Yaka, vous acceptez les
                pratiques décrites dans cette politique.
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
