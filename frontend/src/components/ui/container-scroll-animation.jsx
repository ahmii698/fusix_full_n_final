import React, { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      ref={containerRef}
      style={{
        height: isMobile ? '60rem' : '80rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: isMobile ? '8px' : '80px',
        zIndex: 1
      }}
    >
      <div
        style={{
          paddingTop: isMobile ? '40px' : '160px',
          paddingBottom: isMobile ? '40px' : '160px',
          width: '100%',
          position: 'relative',
          perspective: '1000px',
          zIndex: 2
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} scale={scale} isMobile={isMobile}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({ rotate, scale, children, isMobile }) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale: scale,
        maxWidth: '1024px',
        marginTop: '-48px',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: isMobile ? '30rem' : '40rem',
        width: '100%',
        border: '4px solid #6C6C6C',
        padding: isMobile ? '8px' : '24px',
        background: '#222222',
        borderRadius: '30px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}
    >
      <div style={{
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        borderRadius: '16px',
        background: '#1f2937'
      }}>
        {children}
      </div>
    </motion.div>
  );
};