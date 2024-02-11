import LoadingImage from '@/components/Loading';
import ParallelModal from '@/components/Modal/Parallel';

export default function Loading() {
  return (
    <ParallelModal>
      <LoadingImage />
    </ParallelModal>
  );
}
