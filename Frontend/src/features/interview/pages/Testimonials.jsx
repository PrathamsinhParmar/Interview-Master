import React from 'react'
import { motion } from "motion/react"
import { TestimonialsColumn } from '../components/TestimonialsColumn'
import Navbar from '../../../components/Navbar.jsx'
import Footer from '../../../components/Footer.jsx'
import '../styles/testimonials.scss'

const testimonials = [
  {
    text: "Nexviva's AI perfectly simulated the pressure of a real technical interview. It helped me land my dream role at Google!",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Briana Patton",
    role: "Software Engineer",
  },
  {
    text: "The roadmap it generated after my behavioral mock interview showed me exactly where I needed to improve my STAR methodology.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Bilal Ahmed",
    role: "Product Manager",
  },
  {
    text: "The instant feedback and incredibly realistic voice responses from the AI interviewer completely changed how I prepare.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Saman Malik",
    role: "Frontend Developer",
  },
  {
    text: "I was struggling with system design questions. The targeted technical questions this app generated gave me the edge I needed.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Omar Raza",
    role: "Backend Lead",
  },
  {
    text: "I used to get extremely nervous during interviews. Practicing with this tool daily built my confidence immensely.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Zainab Hussain",
    role: "Data Scientist",
  },
  {
    text: "The tailored feedback on my communication skills was a game-changer. I secured three offers within a month of using this platform.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Aliza Khan",
    role: "UX Designer",
  },
  {
    text: "I love how it analyzes my resume and dynamically creates questions. It's like having a senior engineer mentoring you 24/7.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "Farhan Siddiqui",
    role: "Full Stack Developer",
  },
  {
    text: "The skill gaps analysis is brilliant. It told me I was weak on database indexing, which ended up being exactly what I was asked.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Sana Sheikh",
    role: "Database Administrator",
  },
  {
    text: "As a new grad, I had no idea what to expect. Nexviva prepared me for everything from HR screens to deep technical rounds.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Hassan Ali",
    role: "Junior Developer",
  },
]

const firstColumn = testimonials.slice(0, 3)
const secondColumn = testimonials.slice(3, 6)
const thirdColumn = testimonials.slice(6, 9)

const Testimonials = () => {
  return (
    <div className="testimonials-page">
      <Navbar />

      <div className="testimonials-bg-orbs">
          <div className="orb orb--1"></div>
          <div className="orb orb--2"></div>
      </div>

      <div className="testimonials-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="testimonials-header"
        >
          <h2 className="testimonials-header__title">
            What our users say
          </h2>
          <p className="testimonials-header__subtitle">
            Discover how Nexviva is helping candidates worldwide conquer their interview anxiety and land their dream jobs.
          </p>
        </motion.div>

        <div className="testimonials-grid">
          <TestimonialsColumn className="col-1" testimonials={firstColumn} duration={15} />
          <TestimonialsColumn className="col-2" testimonials={secondColumn} duration={19} />
          <TestimonialsColumn className="col-3" testimonials={thirdColumn} duration={17} />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Testimonials
