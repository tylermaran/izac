// Importing Dependencies
import React, { useState } from 'react';

// Importing styling
import './Confirm.css'

// Importing Components
import Animation from '../components/Animation';

const Confirm = (props) => {
  console.log(props);
  const [animation, setAnimation] = useState(false)

  let div;
  let pour = 'Pour';

  if (animation) {
    div = (
      <div className="confirm_animation">
        <Animation time = {props.pourTime} />
      </div>
    )
    pour = 'Pouring...'
  } else {
    div = (
      <div className="confirm_image"></div>
    )
  }

  if (props.drinkComplete) {
    pour = 'Enjoy!';
    setTimeout(()=> {
      props.closeModal();
    }, 2000)
  }

  return (
    <div className="confirm">
      <div className="backdrop" onClick={() => props.closeModal()}> </div>

      <div className="popup">
        <div className="confirm_title">
          Confirm Drink
        </div>
        {div}

        <button type="button" className="pour_drink" onClick={()=> {
          setAnimation(true);
          props.handleConfirm();
        }}>
          {pour}
        </button>
      </div>

    </div>
  )

}

export default Confirm;
