import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const testimonials = [
  {
    name: "Ravi Kumar",
    role: "Student, Baat-Cheet",
    text: "The Baat-Cheet program completely transformed my confidence. I used to be terrified of speaking up, but now I feel like my voice matters.",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
  },
  {
    name: "Sneha Patel",
    role: "Participant, Sahi Manzil",
    text: "Sahi Manzil gave me the direction I needed for my career. The digital skills and presentation tips were exactly what I was missing.",
    avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d"
  },
  {
    name: "Amit Sharma",
    role: "School Teacher",
    text: "Samikaran's workshops are truly inspiring and practical. The students are so much more engaged and expressive now.",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
  },
  {
    name: "Priya Singh",
    role: "ITI Graduate",
    text: "I had the technical skills, but Samikaran taught me how to communicate them. It made all the difference in my recent job interviews.",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d"
  },
  {
    name: "Vikram Gupta",
    role: "Parent",
    text: "Seeing my son confidently participate in the workshop was a proud moment. The team truly knows how to bring out the best in children.",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d"
  },
  {
    name: "Anjali Verma",
    role: "Volunteer",
    text: "Volunteering here has been incredibly fulfilling. The impact is visible, and the approach is genuinely transformative for these kids.",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d"
  },
  {
    name: "Rahul Desai",
    role: "College Student",
    text: "The resume building session and mock interviews opened my eyes to modern workplace expectations. Highly recommended!",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026102d"
  },
  {
    name: "Kavita Rao",
    role: "NGO Partner",
    text: "Collaborating with Samikaran has been a breeze. Their dedication to bridging opportunity gaps is unmatched in the region.",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026502d"
  },
  {
    name: "Mohit Jain",
    role: "Student, Sahi Manzil",
    text: "I didn't know how to use Canva or AI tools before this. Now I help my friends with their projects. It's empowering.",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026802d"
  }
];

const mediaImages = [
  {
    title: "Workshop Interaction",
    mainImage: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop",
    type: "Workshop",
    category: "workshop",
    description: "An engaging workshop session where students actively participate in group discussions.",
    gallery: [
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=2070&auto=format&fit=crop"
    ]
  },
  {
    title: "Classroom Learning",
    mainImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop",
    type: "Education",
    category: "education",
    description: "Dedicated learning environment focusing on essential skills.",
    gallery: [
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop"
    ]
  },
  {
    title: "Mentorship Session",
    mainImage: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop",
    type: "Mentorship",
    category: "mentorship",
    description: "One-on-one mentorship session providing career guidance.",
    gallery: [
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop"
    ]
  },
  {
    title: "Community Outreach",
    mainImage: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop",
    type: "Outreach",
    category: "community",
    description: "Connecting with the local community to spread awareness.",
    gallery: [
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop"
    ]
  }
];

async function seed() {
  console.log('Seeding Testimonials...');
  
  // Clean existing data
  await supabase.from('testimonials').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  for (const t of testimonials) {
    const { error } = await supabase.from('testimonials').insert([t]);
    if (error) {
      console.error(`Error inserting testimonial ${t.name}:`, error.message);
    } else {
      console.log(`Inserted testimonial: ${t.name}`);
    }
  }

  console.log('\nSeeding Media Images for Carousel...');
  
  // Clean existing media
  await supabase.from('media').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  for (const m of mediaImages) {
    const { error } = await supabase.from('media').insert([m]);
    if (error) {
      console.error(`Error inserting media ${m.title}:`, error.message);
    } else {
      console.log(`Inserted media: ${m.title}`);
    }
  }

  console.log('\nDone seeding!');
  process.exit(0);
}

seed();
