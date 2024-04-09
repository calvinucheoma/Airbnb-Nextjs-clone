import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CreationSubmit } from './SubmitButtons';

const CreationBottomBar = () => {
  return (
    <div className="fixed w-full bottom-0 z-10 bg-white border-t h-24">
      <div className="flex items-center justify-between mx-auto px-5 h-full lg:px-10">
        <Button variant="secondary" size="lg" asChild type="button">
          <Link href="/">Cancel</Link>
        </Button>
        <CreationSubmit />
      </div>
    </div>
  );
};

export default CreationBottomBar;
