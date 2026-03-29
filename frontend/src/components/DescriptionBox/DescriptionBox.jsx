import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>

      {/* Tabs */}
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">
          Reviews (122)
        </div>
      </div>

      {/* Description */}
      <div className="descriptionbox-description">
        <p>
          An e-commerce website is an online platform that facilitates buying
          and selling of products or services over the internet. It serves as a
          virtual marketplace where businesses and individuals showcase their
          products, interact with customers, and conduct transactions without
          the need for a physical presence.
        </p>

        <p>
          E-commerce websites have gained immense popularity due to their
          convenience, accessibility, and the global reach they offer.
        </p>
      </div>

    </div>
  )
}

export default DescriptionBox