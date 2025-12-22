//assignment requirements are commented! (plus other comments in general)
import { motion } from "motion/react"; //animations
import { Users, Target, Shield, Heart, BookOpen, TrendingUp } from "lucide-react"; //icons 
import Layout from "./Layout";
import PageHero from "./PageHero";

export default function About() {
  // this is the container for animations, like when sectiom appears it fades it and animates each section after (child)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, //waits 2 secs 
      },
    },
  };

  // starts hidden then move to place (fades in) --still for animation
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // transition feel
  const itemTransition = {
    duration: 0.6,
    easing: [0.16, 1, 0.3, 1], // smooth like natrual 
  };

  //our values section (--with the icons)
  const values = [
    { icon: Users, title: "Accessibility", description: "Education pathways should be understandable to everyone—students, families, and advisors—regardless of prior knowledge about academic systems.", color: "from-red-600 to-red-400",},
    { icon: Target, title: "Clarity", description: "We present information in plain language, with transparent connections between skills, courses, majors, and jobs.", color: "from-red-600 to-red-400",},
    { icon: Shield, title: "Empowerment", description: "Students deserve tools that help them take control of their academic journey, not systems that add to their uncertainty.", color: "from-red-600 to-red-400",},
    { icon: Heart, title: "Equity", description: "All students—especially those who are first-generation, transfer, or unfamiliar with higher education—should have equal access to the information they need to succeed.", color: "from-red-600 to-red-400",}, //tailwind (to do gradiant, change color + nums)
  ];

  return (
    <Layout>
      <PageHero
        title="About Us"
        imageSrc="https://umd-today.transforms.svdcdn.com/production/heroes/today/footer-campus-fall.jpg?w=1920&h=1920&q=80&fm=webp&fit=max&dm=1754674669&s=ddcfbda8b0706736d7deee02b302b1d8"
      />

      {/* the problem section */}
      <div className="bg-gray-50 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-7xl mx-auto px-8"
        >
          <motion.h2
            variants={itemVariants}
            transition={itemTransition}
            className="text-4xl text-[rgb(240,177,0)] mb-10 tracking-tight text-center"
          >
            The Problem
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div
              variants={itemVariants}
              transition={itemTransition}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg p-6 border border-gray-200 shadow-md"
            >
              <div className="text-center">
                <div className="text-5xl text-red-600 mb-3">70%</div>
                <p className="text-base text-gray-700 leading-relaxed">
                  of students change majors at least once
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              transition={itemTransition}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg p-6 border border-gray-200 shadow-md"
            >
              <div className="text-center">
                <div className="text-5xl text-red-600 mb-3">50%</div>
                <p className="text-base text-gray-700 leading-relaxed">
                  of graduates work in jobs unrelated to their degree/minors/certificates 
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              transition={itemTransition}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg p-6 border border-gray-200 shadow-md"
            >
              <div className="text-center">
                <div className="text-5xl text-red-600 mb-3">$30k+</div>
                <p className="text-base text-gray-700 leading-relaxed">
                  is the average cost of switching majors or delayed graduation by a few semesters
                </p>
              </div>
            </motion.div>
          </div>

          <motion.p
            variants={itemVariants}
            transition={itemTransition}
            className="text-lg text-gray-700 text-center max-w-3xl mx-auto leading-relaxed"
          >
            Students need better tools to understand how their academic choices connect to real career paths.
          </motion.p>
        </motion.div>
      </div>

      {/* our mission */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="max-w-7xl mx-auto px-8 py-20"
      >
        <motion.h2
          variants={itemVariants}
          transition={itemTransition}
          className="text-4xl text-yellow-500 mb-8 tracking-tight"
        >
          Our Mission
        </motion.h2>

        <div className="max-w-3xl space-y-6">
          <motion.p
            variants={itemVariants}
            transition={itemTransition}
            className="text-lg text-black leading-relaxed"
          >
            Major Decisions helps students make informed, confident academic decisions by connecting majors, courses, and careers through the skills they develop and use.
          </motion.p>

          <motion.p
            variants={itemVariants}
            transition={itemTransition}
            className="text-lg text-black leading-relaxed"
          >
            We believe students shouldn't have to navigate complex degree catalogs alone or guess which major leads to which career. By starting with job titles and skills and not degree names —we reduce confusion, wasted time, and stress.
          </motion.p>

          <motion.p
            variants={itemVariants}
            transition={itemTransition}
            className="text-lg text-black leading-relaxed"
          >
            Our platform bridges the gap between what students want to do and what they need to study, making the path from enrollment to employment clearer and more intentional.
          </motion.p>
        </div>
      </motion.div>

      {/* our values */}
      <div className="bg-gray-50 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-7xl mx-auto px-8"
        >
          <motion.h2
            variants={itemVariants}
            transition={itemTransition}
            className="text-4xl text-yellow-500 mb-12 tracking-tight"
          >
            Our Values
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  variants={itemVariants}
                  transition={itemTransition}
                  whileHover={{
                    scale: 1.05,
                    boxShadow:
                      "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                  }}
                  className="bg-white rounded-lg p-8 border border-gray-200 cursor-pointer group"
                >
                  <div
                    className={`w-16 h-16 rounded-lg bg-gradient-to-br ${value.color} mb-6 flex items-center justify-center`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl text-black mb-3 group-hover:text-red-600 transition-colors">
                    {value.title}
                  </h3>

                  <p className="text-lg text-gray-700 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* who we design for */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="max-w-7xl mx-auto px-8 py-20"
      >
        <motion.h2
          variants={itemVariants}
          transition={itemTransition}
          className="text-4xl text-yellow-500 mb-8 tracking-tight"
        >
          Who We Design For
        </motion.h2>

        <div className="max-w-3xl">
          <motion.p
            variants={itemVariants}
            transition={itemTransition}
            className="text-lg text-black leading-relaxed mb-6"
          >
            Major Decisions is built for students at critical decision points in their academic journey:
          </motion.p>

          <motion.ul variants={containerVariants} className="space-y-4 mb-6">
            {[
              "Students who know the career they want but not which major will get them there",
              "Students overwhelmed by long degree catalogs and unclear program descriptions",
              "Students seeking clarity on what skills they'll learn and how those skills connect to real jobs",
            ].map((text, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                transition={itemTransition}
                className="text-lg text-black leading-relaxed flex items-start gap-3"
              >
                <span className="text-red-600 text-2xl flex-shrink-0">•</span>
                <span>{text}</span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.p
            variants={itemVariants}
            transition={itemTransition}
            className="text-lg text-black leading-relaxed"
          >
            While our primary focus is on current undergraduate and transfer students, our platform also benefits academic advisors and prospective students exploring their options.
          </motion.p>
        </div>
      </motion.div>

      {/* our approach */}
      <div className="bg-gray-50 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-7xl mx-auto px-8"
        >
          <motion.h2
            variants={itemVariants}
            transition={itemTransition}
            className="text-4xl text-yellow-500 mb-8 tracking-tight"
          >
            Our Approach
          </motion.h2>

          <div className="max-w-3xl">
            <motion.div
              variants={itemVariants}
              transition={itemTransition}
              className="bg-white rounded-lg p-8 border-l-4 border-red-600 shadow-lg mb-6"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <BookOpen className="w-8 h-8 text-red-600 flex-shrink-0" />
                </motion.div>

                <p className="text-lg text-black leading-relaxed">
                  Major Decisions uses publicly available data to build transparent pathways between education and employment. We link job titles, required skills, and University of Maryland courses to help students see exactly how their coursework prepares them for specific careers.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              transition={itemTransition}
              className="bg-white rounded-lg p-8 border-l-4 border-yellow-500 shadow-lg mb-6"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Target className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                </motion.div>

                <p className="text-lg text-black leading-relaxed">
                  Rather than relying on vague program descriptions or outdated stereotypes about majors, we show students the concrete connections between what they'll study and what they'll be able to do with those skillsets they acquire.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              transition={itemTransition}
              className="bg-white rounded-lg p-8 border-l-4 border-red-600 shadow-lg"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <TrendingUp className="w-8 h-8 text-red-600 flex-shrink-0" />
                </motion.div>

                <p className="text-lg text-black leading-relaxed">
                  Our methodology is evidence-based, student-centered, and designed to evolve as labor markets and academic programs evolve over time.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
