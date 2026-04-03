import React from 'react';

const Hero = () => {
  return (
    <section className="hero" style={{ 
      height: '450px', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      textAlign: 'center',
      color: 'white',
      // Ссылка на твою предыдущую картинку (уютный интерьер)
      background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2070&auto=format&fit=crop") center/cover no-repeat'
    }}>
      <h1 style={{ 
        fontSize: '3.5rem', 
        marginBottom: '15px', 
        fontWeight: 'bold',
        textShadow: '2px 2px 8px rgba(0,0,0,0.6)' 
      }}>
        Тұрғын үйді жалға беру
      </h1>
      <p style={{ 
        fontSize: '1.4rem', 
        maxWidth: '600px',
        textShadow: '1px 1px 4px rgba(0,0,0,0.6)' 
      }}>
        Өзіңізге ыңғайлы және шипалы баспананы EcoHome-мен бірге табыңыз
      </p>
    </section>
  );
};

export default Hero;