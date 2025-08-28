// スクロールフェードイン
const faders = document.querySelectorAll('.feature, .gallery, .testimonials');
const appearOptions = { threshold: 0.1 };
const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, appearOptions);
faders.forEach(fader => appearOnScroll.observe(fader));
