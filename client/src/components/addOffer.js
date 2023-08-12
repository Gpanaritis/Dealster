import { useParams } from "react-router-dom";

const AddOffer = () => {
  const { supermarket_id } = useParams();
  // Use the supermarket_id parameter to fetch data for the specified supermarket
  return (
    <div>
      <h1>Supermarket {supermarket_id}</h1>
      {/* Display the data for the specified supermarket */}
    </div>
  );
};

export default AddOffer;