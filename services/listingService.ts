
import { LandListing, SellData } from '../types';
import { PAYMENT_URL } from '../constants';

export const fetchListings = async (): Promise<LandListing[]> => {
  try {
    // Adding a cache buster to prevent stale results
    const response = await fetch(`${PAYMENT_URL}?action=getListings&_=${Date.now()}`);
    if (!response.ok) throw new Error("Failed to fetch");
    const data = await response.json();
    return data as LandListing[];
  } catch (error) {
    console.warn("Falling back to local storage due to fetch error:", error);
    const local = localStorage.getItem('land_listings');
    return local ? JSON.parse(local) : [];
  }
};

export const submitListing = async (data: LandListing): Promise<void> => {
  const queryParams = new URLSearchParams({
    action: 'addListing',
    id: data.id,
    landX: data.landX,
    landY: data.landY,
    price: data.price.toString(),
    buildType: data.buildType,
    sellerBkash: data.sellerBkash,
    code: data.code,
    imageUrl: data.imageUrl || '',
    timestamp: data.timestamp
  });

  try {
    await fetch(`${PAYMENT_URL}?${queryParams.toString()}`, {
      method: 'GET',
      mode: 'no-cors'
    });
    
    // Also update local storage for instant feedback
    const existing = JSON.parse(localStorage.getItem('land_listings') || '[]');
    localStorage.setItem('land_listings', JSON.stringify([...existing, data]));
  } catch (error) {
    console.error("Listing submission error:", error);
    throw new Error("Failed to post listing online.");
  }
};
