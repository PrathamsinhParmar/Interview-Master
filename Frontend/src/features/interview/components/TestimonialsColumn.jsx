import React from 'react'
import { motion } from "motion/react"

export const TestimonialsColumn = ({ className, testimonials, duration = 10 }) => {
  return (
    <div className={className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="testimonials-col"
      >
        {[...new Array(2)].fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {testimonials.map(({ text, image, name, role }, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-card__text">{text}</div>
                <div className="testimonial-card__author">
                  <img src={image} alt={name} />
                  <div className="testimonial-card__info">
                    <div className="testimonial-card__name">{name}</div>
                    <div className="testimonial-card__role">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  )
}
