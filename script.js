const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

// Product filter
const filterButtons = document.querySelectorAll(".filter-tabs button");
const products = document.querySelectorAll(".product-card");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;

    products.forEach(card => {
      card.style.display = filter === "all" || card.dataset.category === filter ? "" : "none";
    });
  });
});

// Testimonial slider
const testimonials = document.querySelectorAll(".testimonial");
let currentTestimonial = 0;

function showTestimonial(index) {
  testimonials.forEach((item, i) => item.classList.toggle("active", i === index));
}
document.getElementById("prevTestimonial").addEventListener("click", () => {
  currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
  showTestimonial(currentTestimonial);
});
document.getElementById("nextTestimonial").addEventListener("click", () => {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
});

// Contact form: send the request to WhatsApp and email (FormSubmit).
const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const note = document.getElementById("formNote");
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const data = Object.fromEntries(new FormData(contactForm).entries());

  const ownerWhatsApp = "6283862873325";
  const ownerEmail = "syihabulmilal06@gmail.com";
  const message = [
  "Halo Denma Furniture, saya ingin konsultasi.",
  "",
  `Nama: ${data.nama}`,
  `WhatsApp: ${data.telepon}`,
  `Email: ${data.email || "-"}`,
  `Jenis kebutuhan: ${data.kebutuhan}`,
  `Pesan: ${data.pesan}`
].join("\n");

const whatsappUrl = `https://wa.me/${ownerWhatsApp}?text=${encodeURIComponent(message)}`;

window.open(whatsappUrl, "_blank");

  // Email delivery uses FormSubmit; the owner must verify the address on first use.
  submitButton.disabled = true;
  submitButton.textContent = "Mengirim...";
  note.textContent = "WhatsApp sedang dibuka. Mengirim salinan permintaan ke email...";

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${ownerEmail}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        nama: data.nama,
        telepon: data.telepon,
        email: data.email || "-",
        kebutuhan: data.kebutuhan,
        pesan: data.pesan,
        _subject: "Permintaan Konsultasi - Denma Furniture",
        _template: "table",
        _captcha: "false"
      })
    });

    const result = await response.json();
    if (!response.ok || result.success === "false" || result.success === false) {
      throw new Error(result.message || "Email belum berhasil dikirim.");
    }

    note.textContent = "Permintaan dikirim ke WhatsApp. Salinan juga berhasil dikirim ke email.";
    contactForm.reset();
  } catch (error) {
    note.textContent = "WhatsApp sudah dibuka. Pengiriman email belum berhasil; periksa koneksi dan verifikasi alamat email FormSubmit terlebih dahulu.";
    console.error("Gagal mengirim email:", error);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Kirim Permintaan ↗";
  }
});

// Reveal on scroll
const revealItems = document.querySelectorAll(".product-card, .service, .process-item, .article-grid article");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
      observer.unobserve(entry.target);
    }
  });
}, {threshold: 0.08});

revealItems.forEach(item => {
  item.style.opacity = "0";
  item.style.transform = "translateY(18px)";
  item.style.transition = "opacity .6s ease, transform .6s ease";
  observer.observe(item);
});

document.head.insertAdjacentHTML("beforeend", `<style>
.revealed{opacity:1!important;transform:translateY(0)!important}
</style>`);
