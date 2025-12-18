import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

//scrolls page to top when new page selected 
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
