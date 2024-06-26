import { createCategoryPage } from '@/app/actions';
import CreationBottomBar from '@/app/components/CreationBottomBar';
import SelectCategory from '@/app/components/SelectCategory';

const StructureRoute = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <div className="w-3/5 mx-auto">
        <h2 className="text-3xl font-semibold tracking-tight transition-colors">
          Which of these best describe your Home?
        </h2>
      </div>

      <form action={createCategoryPage}>
        <input type="hidden" name="homeId" value={params.id} />

        <SelectCategory />

        <CreationBottomBar />
      </form>
    </>
  );
};

export default StructureRoute;

// 'tracking-tight' is for horizontal letter spacing
// We use the 'asChild' property in the <Button> component from shadcn to indicate that the content of the button
// is a child element of another element or that we have a child in the button so that it can handle it properly.
