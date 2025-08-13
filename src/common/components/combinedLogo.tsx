"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { cn } from "@/src/common/lib/utils"

interface CombinedLogoProps {
  className?: string
  variant?: "default" | "compact" | "stacked"
}

export function CombinedLogo({ className }: CombinedLogoProps) {
  const logoVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      className={cn("flex items-center", className)}
      initial="hidden"
      animate="visible"
      variants={logoVariants}
    >
      <motion.div variants={itemVariants} className="flex items-center">
        <Image src="/images/OralsinGestaoInteligenteLogo.png" alt="Oral Sin Logo" width={32} height={32} className="h-8 w-auto" />
      </motion.div>

      <motion.div variants={itemVariants} className="mx-3 h-6 w-px bg-gray-300 dark:bg-gray-700" />

      <motion.div variants={itemVariants}>
        <Image
          src="/images/DEBTLogoEscrito.png"
          alt="DEBT Logo"
          width={160}
          height={32} 
          className="h-4 w-auto"
        />
      </motion.div>
    </motion.div>
  )
}

