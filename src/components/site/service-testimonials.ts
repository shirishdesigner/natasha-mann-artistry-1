export type ServiceTestimonial = {
  quote: string;
  name: string;
  context: string;
};

export const SERVICE_TESTIMONIALS: Record<string, ServiceTestimonial[]> = {
  "bridal-makeup-and-hairstyle": [
    {
      quote:
        "Having one artist for both makeup and hair made my morning effortless. Every detail matched — my veil, my jewellery, my lehenga. I still get compliments on the photos.",
      name: "Simran K.",
      context: "Bride, Brampton",
    },
    {
      quote:
        "The trial gave me total confidence. On the day Natasha was early, calm and unhurried, and the look held through an outdoor ceremony in July heat.",
      name: "Harleen D.",
      context: "Bride, Caledon",
    },
    {
      quote:
        "Soft, romantic and completely me. My mum cried when she saw the finished look — that says everything.",
      name: "Aanchal V.",
      context: "Bride, Mississauga",
    },
  ],
  "bridal-makeup": [
    {
      quote:
        "My skin looked luminous rather than heavy, and it photographed beautifully with flash at the reception.",
      name: "Priya S.",
      context: "Bride, Mississauga",
    },
    {
      quote:
        "I had my own hairstylist and Natasha coordinated timings with her perfectly. Zero stress, gorgeous makeup.",
      name: "Emily T.",
      context: "Bride, Brampton",
    },
    {
      quote:
        "Twelve hours, a lot of tears and a late night — the base never budged.",
      name: "Rupinder G.",
      context: "Bride, Vaughan",
    },
  ],
  "party-makeup-and-hairstyle": [
    {
      quote:
        "Booked for my sangeet and felt like the best-dressed guest in the room. The updo survived hours of dancing.",
      name: "Nadia M.",
      context: "Sangeet",
    },
    {
      quote:
        "She looked at my outfit and immediately knew the right palette. Glamorous without looking overdone.",
      name: "Ashley R.",
      context: "Engagement Party",
    },
    {
      quote:
        "We booked as a group of four and Natasha kept everyone on schedule with such a warm energy.",
      name: "Kiran B.",
      context: "Family Reception",
    },
  ],
  "party-hairstyle": [
    {
      quote:
        "I only needed hair and she still treated it like a full styling session. The low bun was sculptural and held all night.",
      name: "Jasleen A.",
      context: "Reception Guest",
    },
    {
      quote:
        "My hair usually falls flat within an hour. These curls looked exactly the same at midnight.",
      name: "Megan L.",
      context: "Birthday Celebration",
    },
    {
      quote:
        "She placed my dupatta so it stayed perfect through every photo — a detail no one else has ever thought about.",
      name: "Simar T.",
      context: "Mehndi",
    },
  ],
  "party-makeup": [
    {
      quote:
        "Glowing skin, defined eyes and a lip that suited my dress perfectly. Everyone asked who did my makeup.",
      name: "Nadia M.",
      context: "Party Makeup",
    },
    {
      quote:
        "I have sensitive skin and she chose products carefully. No irritation at all, and it looked incredible on camera.",
      name: "Chloe W.",
      context: "Birthday Dinner",
    },
    {
      quote:
        "Booked her for a photo session and the makeup read beautifully in every light setup.",
      name: "Ritika P.",
      context: "Portrait Shoot",
    },
  ],
};

export const getServiceTestimonials = (slug: string) =>
  SERVICE_TESTIMONIALS[slug] ?? [];
