import Config from "react-native-config";
import {MMKV} from "react-native-mmkv";

// Define the possible environments
export enum EEnvironment {
  DEVELOP = "develop",
  PRODUCT = "product"
}

// Determine if the current environment is production
const isProduction: boolean = (new MMKV().getString("env") || (__DEV__ ? EEnvironment.DEVELOP : EEnvironment.PRODUCT)) === EEnvironment.PRODUCT;

/**
 * The used domain based on the environment
 */
const usedDomain: string = (isProduction ? Config.PRO_DOMAIN : Config.DEV_DOMAIN) || "";

// Configuration for application URLs
export let appUrlConfig = {
  APP_API_REQUEST_TIMEOUT: 15000,
  APP_MAIN_URL: usedDomain,

  TERM: Config.TERM_URL,
  POLICIES: Config.POLICY_URL,
  WEBSITE_FRONTEND: Config.WEBSITE_FRONTEND
};

/**
 * Function to switch the environment URL
 * @param {boolean} isProduction - Indicates whether to switch to production environment
 */
export function setUrlEnv(isProduction: boolean): void {
  // Determine the new domain based on the environment
  const newUsedDomain: string = (isProduction ? Config.DEV_DOMAIN : Config.PRO_DOMAIN) || "";

  // Update the application URL configuration
  appUrlConfig = {
    APP_API_REQUEST_TIMEOUT: 15000,
    APP_MAIN_URL: newUsedDomain,

    TERM: Config.TERM_URL,
    POLICIES: Config.POLICY_URL,
    WEBSITE_FRONTEND: Config.WEBSITE_URL
  };
}
