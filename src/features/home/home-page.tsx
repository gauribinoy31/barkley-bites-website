"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useBarkleyStore } from "@/store/use-store";
import { toast } from "sonner";

const heroImage =
  "https://www.barkleybites.com/cdn/shop/files/animals-pet-supplies-natural-4.jpg?v=1762240955&width=832";

export function HomePage() {
  const addToCart = useBarkleyStore((s) => s.addToCart);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-50 to-green-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Elevate their meals
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Gourmet for Your Pup. Good for the Planet.
              </p>
              <Image
                src={heroImage}
                alt="Animals pet supplies natural"
                width={832}
                height={556}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Featured products
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square relative">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mb-3">
                    {product.compareAtPrice && (
                      <div className="flex items-center gap-2">
                        <span className="text-red-600 font-semibold">
                          Sale price ${product.price}
                        </span>
                        <span className="text-gray-500 line-through">
                          Regular price ${product.compareAtPrice}
                        </span>
                      </div>
                    )}
                    {!product.compareAtPrice && (
                      <span className="text-gray-900 font-semibold">
                        ${product.price}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      addToCart({
                        productId: product.id,
                        variantId: product.defaultVariantId,
                        quantity: 1,
                      });
                      toast.success(`${product.name} added to cart!`);
                    }}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Shop Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our shop
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
              Driven by a passion for pet wellness, we embrace a philosophy of nourishment that prioritizes quality and
              authenticity. Our mission is to provide boutique pet food with carefully sourced ingredients, ensuring
              every meal contributes to a healthier, happier life for your beloved companions.
            </p>
            <Link href="/shop">
              <Button className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors">
                Shop now →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tailored Nutrition Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Tailored nutrition
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Formulated for individual needs
            </p>
            <Link href="/shop">
              <Button className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors">
                Shop now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Gourmet Nutrition Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Gourmet nutrition for pets
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              Our boutique offerings combine premium ingredients with irresistible flavors, creating meals that delight
              and nourish.
            </p>
            <Link href="/shop">
              <Button className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors">
                Shop now
              </Button>
            </Link>
            <p className="text-gray-600 mt-4">
              Transform mealtime into a cherished ritual, where every bite brings joy and well-being.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
