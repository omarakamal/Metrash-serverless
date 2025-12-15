import "dotenv/config";
import { db } from "../lib/db.js";
import { products } from "./schema/product.js";

const DATA = [
  {
    name: "Coca-Cola 1.5L",
    price: "0.75",
    description: "Refreshing soft drink",
    imageUrl: "https://i5.walmartimages.com/seo/Coca-Cola-Soda-Pop-12-fl-oz-Can_14a1f5dc-f8bf-4071-9aea-0f753c3eecf4.08041b7f0a409ee67d80e489be3c1c55.jpeg",
  },
  {
    name: "Sprite",
    price: "0.75",
    description: "Refreshing soft drink",
    imageUrl: "https://dtgxwmigmg3gc.cloudfront.net/imagery/assets/derivations/icon/512/512/true/eyJpZCI6IjY2NjA0YWQwYWYyYWViZTM2ODM0ZTQ3NDBlMDYwZDcyLmpwZyIsInN0b3JhZ2UiOiJwdWJsaWNfc3RvcmUifQ?signature=7c9ca553888bafcf5adda5e850cbc37b8bb77752a38d48f4ce69ad7c17f3d2df",
  },
  {
    name: "Fanta Grape",
    price: "0.75",
    description: "Refreshing soft drink",
    imageUrl: "https://www.sosweetshop.co.uk/cdn/shop/files/fanta-grape-can-500ml-347506.png?v=1712771549&width=1214",
  },
  {
    name: "Mountain Dew",
    price: "0.75",
    description: "Refreshing soft drink",
    imageUrl: "https://cdn.metcash.media/image/upload/f_auto,c_limit,w_750,q_auto/igashop/images/593773_1",
  },
  {
    name: "Kinza",
    price: "0.25",
    description: "Refreshing soft drink",
    imageUrl: "https://retailimgs-magna.s3.me-south-1.amazonaws.com/stores/709/products/fbf1c406da6b62e486ec609aa56737e3.png",
  },
  {
    name: "Kinza Diet",
    price: "0.25",
    description: "Refreshing soft drink",
    imageUrl: "https://img.ananinja.com/media/ninja-catalog-42/420d7957-5452-4338-a52a-4a5db6f1b7e6.webp?w=3840&q=90",
  },
  {
    name: "Fanta Strawberry",
    price: "0.75",
    description: "Refreshing soft drink",
    imageUrl: "https://cdn.mafrservices.com/sys-master-root/hed/h1f/9511634927646/23615_main.jpg",
  },
  {
    name: "Fairy Cleaner",
    price: "1.5",
    description: "Refreshing soft drink",
    imageUrl: "https://talabat.dhmedia.io/image/product-information-management/68a42ba58e356b80a4cedc67.jpg?size=520",
  },
    {
    name: "Ariel Detergent",
    price: "0.75",
    description: "Refreshing soft drink",
    imageUrl: "https://images.ctfassets.net/550rsbcikbrb/3MBoM8fpvUXKmEdbIgsA9F/762e322cc0bc3230ffffe5a717ae00e5/Ariel_UK_Original_Liquid_0720.png?fm=jpg&fl=progressive",
  },
    {
    name: "Clorox",
    price: "2.9",
    description: "Refreshing soft drink",
    imageUrl: "https://i5.walmartimages.com/asr/e8a7d160-6cf3-483a-bfc5-ded15f8f6243.3d27c679c8696e24d502e1ab418e1687.jpeg",
  },
    {
    name: "Paper Plates",
    price: "0.3",
    description: "",
    imageUrl: "https://cdn.mafrservices.com/sys-master-root/h73/hf8/12953453035550/1729262_main.jpg?im=Resize=376",
  },
  {
    name: "plastic spoons",
    price: "0.3",
    description: "",
    imageUrl: "https://cdn.mafrservices.com/sys-master-root/h4f/h16/46286842855454/1729268_main.jpg?im=Resize=376",
  },
  {
    name: "plastic knives",
    price: "0.3",
    description: "",
    imageUrl: "https://cdn.mafrservices.com/sys-master-root/h09/h01/13704752594974/1729270_main.jpg?im=Resize=376",
  },
  {
    name: "aluminum foil",
    price: "0.3",
    description: "",
    imageUrl: "https://www.allrecipes.com/thmb/BoxoiPyfiLYcAc2GWY2HVIURbzA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/102368196_aluminum-foil-2000-4af779937cc9438cbe9be9d54c1f2e34.jpg",
  },
  {
    name: "Galaxy Bar",
    price: "0.3",
    description: "",
    imageUrl: "https://www.ubuy.com.bh/productimg/?image=aHR0cHM6Ly9tLm1lZGlhLWFtYXpvbi5jb20vaW1hZ2VzL0kvNTFCZ05VZXBhWUwuX1NMMTAxMF8uanBn.jpg",
  },
  {
    name: "M&Ms",
    price: "0.3",
    description: "",
    imageUrl: "https://m.media-amazon.com/images/I/41X1BzvlkRL._SS400_.jpg",
  },
  {
    name: "M&Ms Peanut",
    price: "0.3",
    description: "",
    imageUrl: "https://i5.walmartimages.com/seo/M-M-s-Peanut-Milk-Chocolate-Candy-Theater-Box-3-1-oz-Box_0fa3ae2f-1b1e-48fe-8fd7-9ff13b509d2a.79869b3044b4c19b6f81fb2e2d23d944.jpeg",
  },
];

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // OPTIONAL: clear table first
    // await db.delete(products);

    await db.insert(products).values(DATA);

    console.log(`✅ Seeded ${DATA.length} products`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
