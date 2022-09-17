import { useEffect, useRef } from "react";

function useReachBottom(
  el: Element,
  callback: (e?: Event) => void,
  deps: any[] = []
) {
  let fn = useRef(callback).current
  fn = callback
  useEffect(() => {
    if (!el) return;

    const onReach = (e: Event) => {
      const ele = e.currentTarget as any
      if (ele.clientHeight + ele.scrollTop >= ele.scrollHeight) {
        fn(e)
      }
    }

    el.addEventListener('scroll', onReach)

    return () => {
      el.removeEventListener('scroll', onReach)
    }
  }, [el, ...deps])
}

export default useReachBottom
