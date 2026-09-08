const portraitControl = document.querySelector("[data-portrait-control]");

if (portraitControl) {
  const portraitImage = portraitControl.querySelector("img");
  const portraitCount = portraitControl.querySelector("[data-portrait-count]");
  let alternateCrop = false;

  portraitControl.addEventListener("click", () => {
    alternateCrop = !alternateCrop;
    portraitImage.classList.toggle("is-alternate", alternateCrop);
    portraitCount.textContent = alternateCrop ? "Crop 2 of 2" : "Crop 1 of 2";
  });
}

const contactTicket = document.querySelector("[data-contact-ticket]");

if (contactTicket) {
  const ticketStatus = contactTicket.querySelector("[data-ticket-status]");
  const originalStatus = ticketStatus.textContent;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let resetTimer;
  let flashTimer;

  const resetTicket = () => {
    contactTicket.style.setProperty("--ticket-x", "0deg");
    contactTicket.style.setProperty("--ticket-y", "0deg");
    contactTicket.style.setProperty("--ticket-scale", "1");
  };

  contactTicket.addEventListener("pointermove", (event) => {
    if (reducedMotion.matches || event.pointerType === "touch") return;

    const bounds = contactTicket.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const horizontal = (x / bounds.width - 0.5) * 18;
    const vertical = (y / bounds.height - 0.5) * -18;

    contactTicket.style.setProperty("--ticket-x", `${vertical}deg`);
    contactTicket.style.setProperty("--ticket-y", `${horizontal}deg`);
    contactTicket.style.setProperty("--ticket-scale", "1.045");
    contactTicket.style.setProperty("--mouse-x", `${(x / bounds.width) * 100}%`);
    contactTicket.style.setProperty("--mouse-y", `${(y / bounds.height) * 100}%`);
  });

  contactTicket.addEventListener("pointerleave", resetTicket);

  contactTicket.addEventListener("click", async () => {
    window.clearTimeout(resetTimer);
    window.clearTimeout(flashTimer);
    contactTicket.classList.add("is-holographic", "is-flashing");
    ticketStatus.textContent = "copied to clipboard!";

    try {
      await navigator.clipboard.writeText("me@willchai.com");
    } catch {
      ticketStatus.textContent = "me@willchai.com — ready to copy";
    }

    flashTimer = window.setTimeout(() => {
      contactTicket.classList.remove("is-flashing");
    }, 180);

    resetTimer = window.setTimeout(() => {
      contactTicket.classList.remove("is-holographic");
      ticketStatus.textContent = originalStatus;
      resetTicket();
    }, 3000);
  });
}
