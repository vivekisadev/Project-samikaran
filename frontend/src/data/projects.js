export const projects = [
  {
    id: 1,
    title: "Education for All",
    status: "Active",
    date: "Since 2012",
    location: "Rural Districts, India",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop",
    description: "Providing free study materials, uniforms, and tuition to over 500 underprivileged children in rural districts.",
    fullContent: `
      <p>Education is the most powerful weapon which you can use to change the world. Our "Education for All" initiative ensures that poverty does not stand in the way of a child's future.</p>
      
      <h3>The Challenge</h3>
      <p>In many rural areas, children drop out of school due to the lack of basic supplies like books, uniforms, and inability to pay minor fees. This perpetuates the cycle of poverty.</p>

      <h3>Our Solution</h3>
      <p>We provide comprehensive support:</p>
      <ul>
        <li>Free textbooks and stationery for an entire academic year.</li>
        <li>Two sets of uniforms per child.</li>
        <li>After-school tuition centers to help with homework and learning gaps.</li>
        <li>Scholarships for meritorious students to pursue higher education.</li>
      </ul>

      <h3>Impact So Far</h3>
      <p>Starting with just 50 children, we now support over 500 students across 15 villages. We have seen a 40% reduction in dropout rates in our target areas.</p>
    `,
    stats: [
      { label: "Students Supported", value: "500+" },
      { label: "Villages Covered", value: "15" },
      { label: "Years Active", value: "12" }
    ]
  },
  {
    id: 2,
    title: "Clean Water Initiative",
    status: "Actively Recruiting",
    date: "Since 2018",
    location: "Drought-prone Areas",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
    description: "Installing water filtration systems in 10 villages to prevent waterborne diseases and ensure safe drinking water.",
    fullContent: `
      <p>Access to clean drinking water is a basic human right, yet thousands suffer daily from waterborne diseases. Our initiative aims to change this reality.</p>

      <h3>The Crisis</h3>
      <p>Contaminated water sources are the leading cause of health issues in the villages we serve. Women and children often walk miles to fetch water that isn't even safe to drink.</p>

      <h3>Our Intervention</h3>
      <p>We install low-maintenance, high-efficiency community water filtration plants. Each plant is managed by a local committee trained by us, ensuring sustainability.</p>

      <h3>Goals for 2026</h3>
      <p>We aim to expand to 20 more villages and introduce solar-powered pumps to reduce reliance on erratic grid electricity.</p>
    `,
    stats: [
      { label: "Villages Impacted", value: "10" },
      { label: "Daily Liters Filtered", value: "5000+" },
      { label: "Health Incidents Reduced", value: "60%" }
    ]
  }
];
