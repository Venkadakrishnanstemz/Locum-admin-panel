import React from 'react'
import thankyou from '../assets/images/icon-thank-you.svg'

const ThankyouStep = () => {
  return (
    <div className='thanks'>
        <img src={thankyou} alt="Subscription confirmed"/>
        <h2>Thank you!</h2>
        <p>User Data Stored succesfully</p>
    </div>
  )
}

export default ThankyouStep