// MSW Configuration for different environments
export interface MSWConfig {
  enabled: boolean;
  onUnhandledRequest: 'error' | 'warn' | 'bypass';
  quiet?: boolean;
}

// Environment-based MSW configuration
export const getMSWConfig = (): MSWConfig => {
  const isDev = import.meta.env.DEV;
  const isTest = import.meta.env.MODE === 'test';

  // Force enable MSW with environment variable (useful for staging/preview)
  const forceEnable = import.meta.env.VITE_ENABLE_MSW === 'true';

  if (isTest) {
    return {
      enabled: true,
      onUnhandledRequest: 'error', // Strict in tests
      quiet: true,
    };
  }

  if (isDev || forceEnable) {
    return {
      enabled: true,
      onUnhandledRequest: 'warn', // Warn in development
      quiet: false,
    };
  }

  // Production - MSW disabled by default
  return {
    enabled: false,
    onUnhandledRequest: 'bypass',
    quiet: true,
  };
};

// Initialize MSW with environment-specific configuration
export async function initializeMSW(): Promise<void> {
  const config = getMSWConfig();

  if (!config.enabled) {
    if (!config.quiet) {
      console.log('🚀 Production mode - MSW disabled');
    }
    return;
  }

  try {
    const { worker } = await import('./browser');
    await worker.start({
      onUnhandledRequest: config.onUnhandledRequest,
      quiet: config.quiet,
    });

    if (!config.quiet) {
      console.log('🔧 MSW enabled for development');
    }
  } catch (error) {
    console.error('Failed to initialize MSW:', error);
  }
}
