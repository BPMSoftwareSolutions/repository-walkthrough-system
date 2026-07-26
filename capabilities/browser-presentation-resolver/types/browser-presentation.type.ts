export type PresentationSurfaceKind =
  | "repository-web"
  | "documentation-web"
  | "custom-web-viewer";

export type ViewportProfile =
  | "desktop-standard"
  | "desktop-wide"
  | "mobile-portrait";

export interface WalkthroughScene {
  readonly sceneId: string;
  readonly sequence: number;
  readonly purpose: string;
  readonly visualSource: {
    readonly assetId: string;
    readonly assetKind:
      | "repository-document"
      | "repository-file"
      | "repository-directory"
      | "documentation-page";
    readonly path?: string;
  };
  readonly visualSubject: {
    readonly kind:
      | "document-fragment"
      | "source-fragment"
      | "directory-entry"
      | "whole-asset";
    readonly semanticAnchor: string;
  };
  readonly presentationIntent: "establish" | "focus" | "compare" | "conclude";
  readonly transitionIn?: "open-source" | "retain-context" | "return-to-root";
  readonly transitionOut?: "retain-context" | "close-source" | "advance";
}

export interface BrowserPresentationRequest {
  readonly requestId: string;
  readonly walkthroughId: string;
  readonly surface: {
    readonly surfaceId: string;
    readonly kind: PresentationSurfaceKind;
    readonly baseReference?: string;
  };
  readonly viewportProfile: ViewportProfile;
  readonly scenes: readonly WalkthroughScene[];
}

export interface BrowserPresentationOperation {
  readonly operationId: string;
  readonly sequence: number;
  readonly kind:
    | "navigate-to-presentation-asset"
    | "bring-semantic-target-into-view"
    | "focus-semantic-target"
    | "await-presentation-settlement";
  readonly targetReference: {
    readonly assetId: string;
    readonly semanticAnchor: string;
    readonly targetKind?: string;
  };
  readonly policyReference?: string;
  readonly settlementCondition?:
    | "target-visible"
    | "target-stable-and-visible"
    | "page-ready-and-target-visible";
}

export interface ResolvedBrowserPresentation {
  readonly planId: string;
  readonly requestId: string;
  readonly walkthroughId: string;
  readonly surface: {
    readonly surfaceId: string;
    readonly kind: string;
    readonly resolverProfileId: string;
  };
  readonly viewport: {
    readonly profileId: string;
    readonly width: number;
    readonly height: number;
    readonly deviceScaleFactor: number;
  };
  readonly scenes: readonly {
    readonly sceneId: string;
    readonly sequence: number;
    readonly operations: readonly BrowserPresentationOperation[];
  }[];
  readonly disposition: "AUTHORIZED" | "REJECTED";
  readonly findings?: readonly {
    readonly findingId: string;
    readonly code: string;
    readonly message: string;
    readonly sceneId?: string;
  }[];
}

export interface BrowserPresentationResolutionResult {
  readonly presentation: ResolvedBrowserPresentation;
  readonly receipt: Readonly<Record<string, unknown>>;
}
