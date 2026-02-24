type ImagePreloadOptions = {
  fetchPriority?: "high" | "low" | "auto";
  decoding?: "async" | "sync" | "auto";
};

type IdleImagePreloadOptions = ImagePreloadOptions & {
  timeoutMs?: number;
  delayMs?: number;
};

const loadedImageUrls = new Set<string>();
const pendingImagePreloads = new Map<string, Promise<void>>();

function resolveUrls(urls: readonly string[]): string[] {
  return Array.from(new Set(urls.filter(Boolean)));
}

function canPreloadImages(): boolean {
  return typeof window !== "undefined" && typeof Image !== "undefined";
}

export function preloadImage(
  imageUrl: string,
  options: ImagePreloadOptions = {},
): Promise<void> {
  if (!imageUrl || loadedImageUrls.has(imageUrl)) {
    return Promise.resolve();
  }

  const pending = pendingImagePreloads.get(imageUrl);
  if (pending) {
    return pending;
  }

  if (!canPreloadImages()) {
    return Promise.resolve();
  }

  const preloadTask = new Promise<void>((resolve) => {
    const image = new Image();
    image.decoding = options.decoding ?? "async";
    image.fetchPriority = options.fetchPriority ?? "auto";
    let isFinished = false;

    const finish = () => {
      if (isFinished) {
        return;
      }
      isFinished = true;
      image.onload = null;
      image.onerror = null;
      pendingImagePreloads.delete(imageUrl);
      loadedImageUrls.add(imageUrl);
      resolve();
    };

    image.onload = finish;
    image.onerror = finish;
    image.src = imageUrl;

    if (image.complete) {
      finish();
    }
  });

  pendingImagePreloads.set(imageUrl, preloadTask);
  if (loadedImageUrls.has(imageUrl)) {
    pendingImagePreloads.delete(imageUrl);
  }

  return preloadTask;
}

export function preloadImages(
  imageUrls: readonly string[],
  options: ImagePreloadOptions = {},
): Promise<void> {
  const urls = resolveUrls(imageUrls);
  if (urls.length === 0) {
    return Promise.resolve();
  }

  return Promise.all(urls.map(url => preloadImage(url, options))).then(() => undefined);
}

type CancelIdlePreload = () => void;

export function preloadImagesWhenIdle(
  imageUrls: readonly string[],
  options: IdleImagePreloadOptions = {},
): CancelIdlePreload {
  const urls = resolveUrls(imageUrls);
  if (urls.length === 0 || typeof window === "undefined") {
    return () => {};
  }

  const { timeoutMs = 1200, delayMs = 0, ...preloadOptions } = options;

  let idleCallbackId: number | null = null;
  let delayTimerId: number | null = null;

  const run = () => {
    const idleCallback = window.requestIdleCallback;
    if (typeof idleCallback === "function") {
      idleCallbackId = idleCallback(() => {
        void preloadImages(urls, preloadOptions);
      }, { timeout: timeoutMs });
      return;
    }

    idleCallbackId = window.setTimeout(() => {
      void preloadImages(urls, preloadOptions);
    }, 16);
  };

  if (delayMs > 0) {
    delayTimerId = window.setTimeout(run, delayMs);
  } else {
    run();
  }

  return () => {
    if (delayTimerId !== null) {
      window.clearTimeout(delayTimerId);
      delayTimerId = null;
    }

    if (idleCallbackId === null) {
      return;
    }

    const cancelIdleCallback = window.cancelIdleCallback;
    if (typeof cancelIdleCallback === "function") {
      cancelIdleCallback(idleCallbackId);
    } else {
      window.clearTimeout(idleCallbackId);
    }

    idleCallbackId = null;
  };
}
