import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageWithBackButton } from "../../_components/page-with-back-button";
import { ProductDetailsForm } from "../../_components/forms/product-details-form";

export default function NewProductPage() {
  return (
    <PageWithBackButton
      backButtonHref="/dashboard/products"
      pageTitle="Create Product"
    >
      <Card>
        <CardHeader className="text-xl">Product details</CardHeader>
        <CardContent>
          <ProductDetailsForm />
        </CardContent>
      </Card>
    </PageWithBackButton>
  );
}
