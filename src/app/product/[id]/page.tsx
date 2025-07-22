import prisma from "../../../lib/data/prisma";

interface Product {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface Params {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: Params) {
  const id = Number(params.id);

  // Fetch the product from DB directly in server component
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      <p>Created At: {product.createdAt.toString()}</p>
      <p>Updated At: {product.updatedAt.toString()}</p>
      {/* Add more product fields as needed */}
    </div>
  );
}
