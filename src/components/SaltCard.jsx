import React from 'react';
import PropTypes from 'prop-types';
import './SaltCard.css';
import { useState, useEffect } from 'react';

const SaltCard = ({ saltSuggetion }) => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showMore, setShowMore] = useState({});

  useEffect(() => {
    if (saltSuggetion?.length > 0) {
      const initialOptions = saltSuggetion.reduce((acc, item, index) => {
        const saltFormsJson = item.salt_forms_json;
        const hasFormEntries = Object.keys(saltFormsJson).length > 0;

        if (hasFormEntries) {
          const firstForm = Object.keys(saltFormsJson)[0];
          const firstStrength = Object.keys(saltFormsJson[firstForm])[0];
          const firstPacking =Object.keys(saltFormsJson[firstForm][firstStrength])[0]
          acc[index] = {
            selectedForm: firstForm,
            selectedStrength: firstStrength,
            selectedPacking: firstPacking,
          };
        } else {
          acc[index] = {
            selectedForm: null,
            selectedStrength: null,
            selectedPacking: null,
          };
        }

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
      return option.some((item) => item?.selling_price !== null);
    }
    return false;
  };

  const isShowMore = (cardIndex, type) => {
    return (showMore[cardIndex] || {})[type] || false;
  };

  //get the lowest price
  const getLowestPrice = (packings) => {
    let lowestPrice = null;

    if (packings && typeof packings === 'object' && packings !== null) {
      const allProducts = Object.entries(packings)
        .flatMap(([id, products]) => {
          if (Array.isArray(products)) {
            return products.filter((product) => product?.selling_price !== null);
          } else if (products === null) {
            return [];
          } else {
            console.warn(`Unexpected value for productIds: ${id}`, products);
            return [];
          }
        });

      if (allProducts.length > 0) {
        lowestPrice = Math.min(...allProducts.map((product) => product?.selling_price));
      } else {
        lowestPrice = 'NaN';
      }
    } else {
      lowestPrice = 'NaN';
    }

    return lowestPrice;
  };

  console.log('salt sgg-->', saltSuggetion);
  return (
    <>
      {saltSuggetion?.length ? (
        saltSuggetion?.map((item, index) => (
          <div key={index} className="card-container py-5 gap-10 px-10 flex justify-between">
            {/* medicine details list */}
            <div className=' flex flex-col w-auto'>
              {/* Form */}
              <div className="flex gap-2 mb-2 mt-2 ">
                <p className="text-md w-20">Form : &nbsp;</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(item.salt_forms_json).map(([form, strengths], formIndex) => (
                    <React.Fragment key={form}>
                      {(formIndex < 4 || isShowMore(index, 'form')) ? (
                        <button
                          className={`form-button border rounded-md px-2 ${isOptionAvailable(strengths) ? 'border-[#183b41]' : ''
                            } ${selectedOptions[index]?.selectedForm === form
                              ? 'border-2 border-[#1c454c] shadow-[0_0_10px_rgba(17,45,49,0.6)]'
                              : ''
                            }`}
                          onClick={() => handleOptionClick(index, 'form', form)}
                        >
                          {form}
                        </button>
                      ) : null}
                    </React.Fragment>
                  ))}
                  {Object.entries(item.salt_forms_json).length > 4 && (
                    <div className="flex justify-center col-span-2">
                      <button className="text-[#204772] font-bold" onClick={() => toggleShowMore(index, 'form')}>
                        {isShowMore(index, 'form') ? 'Hide' : 'More..'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Strength */}
              <div className="flex  gap-2 mb-2 mt-2">
                <p className="text-md w-20">Strength&nbsp;: &nbsp;</p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedOptions[index]?.selectedForm ? (
                    Object.entries(item.salt_forms_json[selectedOptions[index].selectedForm] || {}).map(
                      ([strength, packings], strengthIndex) => (
                        <React.Fragment key={strength}>
                          {(strengthIndex < 4 || isShowMore(index, 'strength')) ? (
                            <button
                              className={`strength-button border rounded-md px-2 h-7  overflow-hidden whitespace-nowrap text-ellipsis ${isOptionAvailable(packings) ? 'border-[#112D31]' : ''
                                } ${selectedOptions[index]?.selectedStrength === strength
                                  ? 'border-2 border-[#112D31] shadow-[0_0_10px_rgba(17,45,49,0.5)]'
                                  : ''
                                }`}
                              onClick={() => handleOptionClick(index, 'strength', strength)}
                            >
                              {strength}
                            </button>
                          ) : null}
                        </React.Fragment>
                      )
                    )
                  ) : (
                    <span>No strengths available</span>
                  )}
                  {selectedOptions[index]?.selectedForm &&
                    Object.entries(item.salt_forms_json[selectedOptions[index].selectedForm] || {}).length > 4 && (
                      <div className="flex justify-center col-span-2">
                        <button className="text-[#204772] font-bold" onClick={() => toggleShowMore(index, 'strength')}>
                          {isShowMore(index, 'strength') ? 'Hide' : 'More..'}
                        </button>
                      </div>
                    )}
                </div>
              </div>

              {/* Packing */}
              <div className="flex  gap-2 mb-2 mt-2">
                <p className="text-md w-20">Packing : &nbsp;</p>
                <div className="grid grid-cols-2 gap-2">
                  {
                    selectedOptions[index]?.selectedForm && selectedOptions[index]?.selectedStrength
                      ? Object.entries(
                        item.salt_forms_json[selectedOptions[index].selectedForm]?.[
                        selectedOptions[index].selectedStrength
                        ] || {}
                      ).map(([packing, productIds], packingIndex) => (
                        <React.Fragment key={packing}>
                          {(packingIndex < 4 || isShowMore(index, 'packing')) ? ( // Show all packings if "More.." is clicked
                            <button
                              className={`packing-btn border rounded-md overflow-hidden text-ellipsis whitespace-nowrap ${isOptionAvailable(productIds) ? 'border-[#112D31] px-2 py-0' : 'px-2 py-0'
                                } ${selectedOptions[index]?.selectedPacking === packing
                                  ? 'border-2 px-2 py-0 border-[#112D31] shadow-[0_0_10px_rgba(17,45,49,0.5)]'
                                  : ''
                                }`}
                              onClick={() => handleOptionClick(index, 'packing', packing)}
                            >
                              {packing}
                            </button>
                          ) : null}
                        </React.Fragment>
                      ))
                      : (
                        <span>No packings available</span>
                      )
                  }
                  {selectedOptions[index]?.selectedForm &&
                    selectedOptions[index]?.selectedStrength &&
                    Object.entries(
                      item.salt_forms_json[selectedOptions[index].selectedForm]?.[
                      selectedOptions[index].selectedStrength
                      ] || {}
                    ).length > 4 ? (
                    <div className="flex justify-end col-span-2">
                      <button className="text-[#204772] font-bold" onClick={() => toggleShowMore(index, 'packing')}>
                        {isShowMore(index, 'packing') ? 'Hide' : 'More..'}
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* medicine name & detail */}
            <div className="flex flex-col justify-center">
              <h4 className="font-bold">{item.salt}</h4>
              <p className="text-[#2A527A] overflow-hidden whitespace-nowrap text-ellipsis">
                {selectedOptions[index]?.selectedForm} | {selectedOptions[index]?.selectedStrength} |{selectedOptions[index]?.selectedPacking}
              </p>
            </div>

            {/* medicine price */}
            <div className="flex flex-col justify-center">
              {selectedOptions[index]?.selectedForm && selectedOptions[index]?.selectedStrength ? (
                <>
                  {getLowestPrice(
                    item.salt_forms_json[selectedOptions[index].selectedForm]?.[
                    selectedOptions[index]?.selectedStrength
                    ]?.[selectedOptions[index]?.selectedPacking]
                  ) !== null && getLowestPrice(
                    item.salt_forms_json[selectedOptions[index].selectedForm]?.[
                    selectedOptions[index]?.selectedStrength
                    ]?.[selectedOptions[index]?.selectedPacking]
                  ) !== 'NaN' ? (
                    <span className="text-[#112D31] font-bold">
                      From₹
                      {getLowestPrice(
                        item.salt_forms_json[selectedOptions[index]?.selectedForm]?.[
                        selectedOptions[index]?.selectedStrength
                        ]?.[selectedOptions[index]?.selectedPacking]
                      )}
                    </span>
                  ) : (
                    <div className="border border-gray-300 p-2 rounded-md">
                      <span>No stores selling this product near you</span>
                    </div>
                  )}
                </>
              ) : null}
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