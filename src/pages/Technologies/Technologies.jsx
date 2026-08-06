import { useEffect, useRef } from 'react';
import {
  // Frontend
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss, // was SiCss3
  SiTailwindcss,
  SiAngular,
  SiVuedotjs,
  SiRedux,

  // Backend
  SiNodedotjs,
  SiExpress,
  SiSpringboot,
  SiDjango,
  SiDotnet,
  SiFastapi,
  SiNestjs,
  SiLaravel,
  SiRubyonrails,
  SiFlask,

  // Database
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiRedis,
  SiApachecassandra,
  SiElasticsearch,
  SiSqlite,

  // Cloud & DevOps
  SiGooglecloud,
  SiDocker,
  SiKubernetes,
  SiJenkins,
  SiGithubactions,
  SiTerraform,
  SiAnsible,
  SiNginx,

  // UI / UX
  SiFigma,
  SiFig,
  SiSketch,
  SiFramer,
  SiMiro,
} from "react-icons/si";

// Microsoft, Amazon/AWS, Oracle, and Adobe brand icons were removed from
// react-icons/si upstream. AWS/Azure/Adobe still exist in the Tabler set.
// MS SQL Server, Oracle, DynamoDB, Zeplin, and ProtoPie have no brand icon
// in any bundled set, so generic equivalents are used for those.
import {
  TbBrandAws,
  TbBrandAzure,
  TbDatabase,      // MS SQL Server
  TbServer2,       // Oracle Database
  TbTable,         // DynamoDB
  TbBrandAdobeXd,
  TbBrandAdobePhotoshop,
  TbBrandAdobeIllustrator,
  TbLayoutGrid,    // Zeplin
  TbClick,         // ProtoPie
} from "react-icons/tb";

import { gsap, prefersReducedMotion } from "../../utils/gsapSetup";
import "./Technologies.css";

const CATEGORIES = [
  {
    name: "Frontend",
    color: "#2563eb",
    techs: [
      { name: "React.js", Icon: SiReact },
      { name: "Next.js", Icon: SiNextdotjs },
      { name: "TypeScript", Icon: SiTypescript },
      { name: "JavaScript (ES6+)", Icon: SiJavascript },
      { name: "HTML5", Icon: SiHtml5 },
      { name: "CSS3", Icon: SiCss },
      { name: "Tailwind CSS", Icon: SiTailwindcss },
      { name: "Angular", Icon: SiAngular },
      { name: "Vue.js", Icon: SiVuedotjs },
      { name: "Redux Toolkit", Icon: SiRedux },
    ],
  },

  {
    name: "Backend",
    color: "#16a34a",
    techs: [
      { name: "Node.js", Icon: SiNodedotjs },
      { name: "Express.js", Icon: SiExpress },
      { name: "Spring Boot", Icon: SiSpringboot },
      { name: "Django", Icon: SiDjango },
      { name: "ASP.NET Core", Icon: SiDotnet },
      { name: "FastAPI", Icon: SiFastapi },
      { name: "NestJS", Icon: SiNestjs },
      { name: "Laravel", Icon: SiLaravel },
      { name: "Ruby on Rails", Icon: SiRubyonrails },
      { name: "Flask", Icon: SiFlask },
    ],
  },

  {
    name: "Database",
    color: "#d97706",
    techs: [
      { name: "PostgreSQL", Icon: SiPostgresql },
      { name: "MySQL", Icon: SiMysql },
      { name: "MongoDB", Icon: SiMongodb },
      { name: "Microsoft SQL Server", Icon: TbDatabase },
      { name: "Oracle Database", Icon: TbServer2 },
      { name: "Redis", Icon: SiRedis },
      { name: "Amazon DynamoDB", Icon: TbTable },
      { name: "Apache Cassandra", Icon: SiApachecassandra },
      { name: "Elasticsearch", Icon: SiElasticsearch },
      { name: "SQLite", Icon: SiSqlite },
    ],
  },

  {
    name: "Cloud & DevOps",
    color: "#0ea5e9",
    techs: [
      { name: "AWS", Icon: TbBrandAws },
      { name: "Microsoft Azure", Icon: TbBrandAzure },
      { name: "Google Cloud Platform", Icon: SiGooglecloud },
      { name: "Docker", Icon: SiDocker },
      { name: "Kubernetes", Icon: SiKubernetes },
      { name: "Jenkins", Icon: SiJenkins },
      { name: "GitHub Actions", Icon: SiGithubactions },
      { name: "Terraform", Icon: SiTerraform },
      { name: "Ansible", Icon: SiAnsible },
      { name: "Nginx", Icon: SiNginx },
    ],
  },

  {
    name: "Design  & tools",
    color: "#dc2626",
    techs: [
      { name: "Figma", Icon: SiFigma },
      { name: "FigJam", Icon: SiFig },
      { name: "Adobe XD", Icon: TbBrandAdobeXd },
      { name: "Sketch", Icon: SiSketch },
      { name: "Framer", Icon: SiFramer },
      { name: "Miro", Icon: SiMiro },
      { name: "ProtoPie", Icon: TbClick },
      { name: "Zeplin", Icon: TbLayoutGrid },
      { name: "Adobe Photoshop", Icon: TbBrandAdobePhotoshop },
      { name: "Adobe Illustrator", Icon: TbBrandAdobeIllustrator },
    ],
  },
];

export default function Technologies() {
  const treeRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || !treeRef.current) return;

    const ctx = gsap.context(() => {
      const root = treeRef.current.querySelector(".tech-root");
      const trunk = treeRef.current.querySelectorAll(".tech-trunk-line");
      const branches = treeRef.current.querySelectorAll(".tech-branch");
      const leaves = treeRef.current.querySelectorAll(".tech-leaf");

      const tl = gsap.timeline({
        defaults: {
          ease: "back.out(1.6)",
        },
      });

      tl.from(root, {
        opacity: 0,
        scale: 0.6,
        duration: 0.5,
      })
        .from(
          trunk,
          {
            scaleY: 0,
            transformOrigin: "top center",
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.15"
        )
        .from(
          branches,
          {
            opacity: 0,
            y: -16,
            duration: 0.5,
            stagger: 0.08,
          },
          "-=0.2"
        )
        .from(
          leaves,
          {
            opacity: 0,
            y: 16,
            scale: 0.5,
            duration: 0.4,
            stagger: 0.03,
          },
          "-=0.2"
        );

      leaves.forEach((leaf, i) => {
        gsap.to(leaf, {
          y: i % 2 === 0 ? -6 : 6,
          duration: 2 + (i % 5) * 0.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.05,
        });
      });
    }, treeRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="tech-page">
      <div className="container-section-tech-header">
        <h1>Our Technology Stack</h1>
        <p className="text-muted">
          HourlyRecruit's engineer network covers the full range of modern
          development skills — organized here like a tree, from foundation to
          leaves.
        </p>
      </div>

      <div className="container tech-tree" ref={treeRef}>
        <div className="tech-root">Technologies We Support</div>

        <div className="tech-trunk-line" />

        <div className="tech-branches">
          {CATEGORIES.map((cat) => (
            <div className="tech-branch-wrap" key={cat.name}>
              <div
                className="tech-branch"
                style={{
                  borderColor: cat.color,
                  color: cat.color,
                }}
              >
                {cat.name}
              </div>

              <div className="tech-leaves">
                {cat.techs.map(({ name, Icon }) => (
                  <div
                    className="tech-leaf"
                    key={name}
                    title={name}
                  >
                    <div
                      className="tech-leaf-icon"
                      style={{
                        color: cat.color,
                      }}
                    >
                      <Icon size={28} />
                    </div>

                    <span className="tech-leaf-label">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}