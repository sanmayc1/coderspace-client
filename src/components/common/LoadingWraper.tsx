import type { ILoadingSkeletonWraper } from "@/types/props.types";

const LoadingSkeletonWraper: React.FC<ILoadingSkeletonWraper> = ({
  isLoading,
  children,
  Skeleton,
}) => {
  if (isLoading) {
    return <Skeleton />;
  }

  return <>{children}</>;
};

export default LoadingSkeletonWraper