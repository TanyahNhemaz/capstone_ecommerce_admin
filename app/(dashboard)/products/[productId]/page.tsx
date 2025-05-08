"use client"

import Loader from '@/components/custom ui/Loader'
import ProductForm from '@/components/products/ProductForm'
import React, { useEffect, useState, useCallback } from 'react'

const ProductDetails = ({ params }: { params: { productId: string }}) => {
  const [loading, setLoading] = useState(true)
  const [productDetails, setProductDetails] = useState<ProductType | null>(null)

  const getProductDetails = useCallback(async () => {
    try { 
      const res = await fetch(`/api/products/${params.productId}`, {
        method: "GET"
      })
      const data = await res.json()
      setProductDetails(data)
      setLoading(false)
    } catch (err) {
      console.log("[productId_GET]", err)
    }
  }, [params.productId]) // Dependency array to re-run the callback when productId changes

  useEffect(() => {
    getProductDetails()
  }, [getProductDetails]) // Run useEffect only when getProductDetails changes

  return loading ? <Loader /> : (
    <ProductForm initialData={productDetails} />
  )
}

export default ProductDetails
