import ImageCard from "./ImageCard";

const PinterestGrid = ({ posts }) => {
  return (
    <div className="columns-2 sm:columns-3 lg:columns-4 gap-6 space-y-6">
      {posts.map(post => (
        <ImageCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PinterestGrid;
