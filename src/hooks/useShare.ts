import { toast } from 'sonner';

interface ShareData {
  title: string;
  price: number;
  productId: string;
}

export function useShare() {
  const getShareUrl = (productId: string) => {
    return `${window.location.origin}/product/${productId}`;
  };

  const share = async ({ title, price, productId }: ShareData) => {
    const url = getShareUrl(productId);
    const text = `Check out "${title}" for ₹${price.toLocaleString()} on CU Bazar!`;

    // Use Web Share API if available (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} - CU Bazar`,
          text,
          url
        });
        return;
      } catch (error) {
        // User cancelled or share failed, fall through to clipboard
        if ((error as Error).name !== 'AbortError') {
          console.error('Share failed:', error);
        }
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      console.error('Clipboard failed:', error);
      toast.error('Failed to copy link');
    }
  };

  const shareToWhatsApp = ({ title, price, productId }: ShareData) => {
    const url = getShareUrl(productId);
    const text = encodeURIComponent(`Check out "${title}" for ₹${price.toLocaleString()} on CU Bazar!\n${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareToFacebook = ({ productId }: { productId: string }) => {
    const url = encodeURIComponent(getShareUrl(productId));
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = ({ title, price, productId }: ShareData) => {
    const url = getShareUrl(productId);
    const text = encodeURIComponent(`Check out "${title}" for ₹${price.toLocaleString()} on CU Bazar!`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
  };

  const copyLink = async (productId: string) => {
    try {
      await navigator.clipboard.writeText(getShareUrl(productId));
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return { share, shareToWhatsApp, shareToFacebook, shareToTwitter, copyLink };
}
