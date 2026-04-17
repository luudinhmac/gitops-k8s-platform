"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

interface AnimateListProps extends Omit<HTMLMotionProps<any>, "as"> {
  children: React.ReactNode;
  delay?: number;
  stagger?: number;
  component?: keyof typeof motion;
}

const AnimateList = (allProps: AnimateListProps) => {
  const { 
    children, 
    delay = 0, 
    stagger = 0.05, 
    component = "div", 
    as: _as, // Explicitly catch and discard any 'as' prop
    ...props 
  } = allProps;
  
  const MotionComponent = (motion as any)[component];
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  // Valid item components for different containers
  const ItemComponent = component === "tbody" ? motion.tr : motion.div;

  const domProps = { ...props };
  delete (domProps as any).as;
  delete (domProps as any).component;
  delete (domProps as any).delay;
  delete (domProps as any).stagger;

  return (
    <MotionComponent
      variants={container}
      initial="hidden"
      animate="show"
      {...domProps}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        
        // If it's a table row, we want to animate it directly or wrap it correctly
        return (
          <ItemComponent
            variants={{
              hidden: { opacity: 0, y: 15 },
              show: { 
                opacity: 1, 
                y: 0, 
                transition: { 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20 
                } 
              },
            }}
          >
            {child.type === 'tr' ? (child as any).props.children : child}
          </ItemComponent>
        );
      })}
    </MotionComponent>
  );
};

export default AnimateList;

