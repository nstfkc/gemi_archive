import { Form, Field, SubmitButton } from "@/lib/client/form";
import { Input } from "./components/ui/Input";

interface ProductEditData {
  message: string;
}

const ProductEditForm = () => {
  return (
    <Form action="/product">
      <div>
        <div className="ff gap-4">
          <Field label="Name" name="name">
            <Input name="name" />
          </Field>
          <Field label="Price" name="price">
            <Input name="price" type="number" />
          </Field>
          <Field label="Description" name="description">
            <Input name="description" />
          </Field>
        </div>
        <SubmitButton>Submit</SubmitButton>
      </div>
    </Form>
  );
};

const ProductEdit = (props: { data: ProductEditData }) => {
  return (
    <div>
      <div className="p-4">
        <div className="max-w-sm">
          <ProductEditForm />
        </div>
      </div>
    </div>
  );
};

export default ProductEdit;
