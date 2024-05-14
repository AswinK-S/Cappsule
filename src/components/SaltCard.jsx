import PropTypes from 'prop-types';
import './SaltCard.css';
import { useState, useEffect } from 'react';

const SaltCard = ({ saltSuggetion }) => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showMore, setShowMore] = useState({});

  useEffect(() => {
    if (saltSuggetion?.length > 0) {
      const initialOptions = saltSuggetion.reduce((acc, item, index) => {
        const firstForm = Object.keys(item.salt_forms_json)[0];
        const firstStrength = Object.keys(item.salt_forms_json[firstForm])[0];
        acc[index] = {
          selectedForm: firstForm,
          selectedStrength: firstStrength,
          selectedPacking: null,
        };
        return acc;
      }, {});
      setSelectedOptions(initialOptions);
    }
  }, [saltSuggetion]);

  const toggleShowMore = (cardIndex, type) => {
    setShowMore((prevState) => ({
      ...prevState,
      [cardIndex]: {
        ...(prevState[cardIndex] || {}),
        [type]: !(prevState[cardIndex] || {})[type],
      },
    }));
  };

  const handleOptionClick = (cardIndex, type, value) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [cardIndex]: {
        ...(prevState[cardIndex] || {}),
        selectedForm: type === 'form' ? value : prevState[cardIndex]?.selectedForm,
        selectedStrength: type === 'strength' ? value : prevState[cardIndex]?.selectedStrength,
        selectedPacking: type === 'packing' ? value : prevState[cardIndex]?.selectedPacking,
      },
    }));
  };

  const isOptionAvailable = (option) => {
    if (Array.isArray(option) && option.length > 0) {
      return option.some((item) => item.selling_price !== null);
    }
    return false;
  };

  const isShowMore = (cardIndex, type) => {
    return (showMore[cardIndex] || {})[type] || false;
  };

  return (
    <>
      {saltSuggetion?.length ? (
        saltSuggetion?.map((item, index) => (
          <div key={index} className="card-container py-5 px-10 flex justify-between">
            {/* medicine details list */}
            <div>
              <div className="flex mb-2 mt-2">
                <p className="text-md w-20">Form : &nbsp;</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(item.salt_forms_json).map(([form, strengths], formIndex) => (
                    <button
                      key={form}
                      className={`border rounded-md px-2 ${
                        isOptionAvailable(strengths) ? 'border-[#112D31]' : 'border-gray-300'
                      } ${selectedOptions[index]?.selectedForm === form ? 'bg-blue-100' : ''}`}
                      onClick={() => handleOptionClick(index, 'form', form)}
                    >
                      {form}
                    </button>
                  ))}
                  {Object.entries(item.salt_forms_json).length > 2 && (
                    <button
                      className="text-blue-500"
                      onClick={() => toggleShowMore(index, 'form')}
                    >
                      {isShowMore(index, 'form') ? 'Hide' : 'More'}
                    </button>
                  )}
                </div>
              </div>
              <div className="flex mb-2 mt-2">
                <p className="text-md w-20">Strength : &nbsp;</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(item.salt_forms_json[selectedOptions[index].selectedForm] || {}).map(([strength, packings], strengthIndex) => (
                    <button
                      key={strength}
                      className={`border rounded-md px-2 ${
                        isOptionAvailable(packings) ? 'border-[#112D31]' : 'border-gray-300'
                      } ${selectedOptions[index]?.selectedStrength === strength ? 'bg-blue-100' : ''}`}
                      onClick={() => handleOptionClick(index, 'strength', strength)}
                    >
                      {strength}
                    </button>
                  ))}
                  {Object.entries(item.salt_forms_json[selectedOptions[index].selectedForm] || {}).length > 2 && (
                    <button
                      className="text-blue-500"
                      onClick={() => toggleShowMore(index, 'strength')}
                    >
                      {isShowMore(index, 'strength') ? 'Hide' : 'More'}
                    </button>
                  )}
                </div>
              </div>
              <div className="flex mb-2 mt-2">
                <p className="text-md w-20">Packing : &nbsp;</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(item.salt_forms_json[selectedOptions[index].selectedForm]?.[selectedOptions[index].selectedStrength] || {}).map(([packing, products], packingIndex) => (
                    <button
                      key={packing}
                      className={`border rounded-md px-2 ${
                        isOptionAvailable(products) ? 'border-[#112D31]' : 'border-gray-300'
                      } ${selectedOptions[index]?.selectedPacking === packing ? 'bg-blue-100' : ''}`}
                      onClick={() => handleOptionClick(index, 'packing', packing)}
                    >
                      {packing}
                    </button>
                  ))}
                  {Object.entries(item.salt_forms_json[selectedOptions[index].selectedForm]?.[selectedOptions[index].selectedStrength] || {}).length > 2 && (
                    <button
                      className="text-blue-500"
                      onClick={() => toggleShowMore(index, 'packing')}
                    >
                      {isShowMore(index, 'packing') ? 'Hide' : 'More'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* medicine name & detail */}
            <div className="flex flex-col justify-center">
              <h4 className="font-bold">{item.salt}</h4>
              <p className="text-[#2A527A]">details</p>
            </div>

            {/* medicine price */}
            <div className="flex flex-col justify-center">
              {selectedOptions[index]?.selectedForm && selectedOptions[index]?.selectedStrength && selectedOptions[index]?.selectedPacking && (
                <span className="text-[#112D31] font-bold">
                  ₹{/* Calculate and display the lowest price */}
                </span>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No data available</p>
      )}
    </>
  );
};

SaltCard.propTypes = {
  saltSuggetion: PropTypes.array.isRequired,
};

export default SaltCard;