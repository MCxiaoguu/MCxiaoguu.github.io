flowchart TD
    A[Image Slicing] -->|Split into B, G, R channels based on row offsets| B(Alignment)
    B --> |Image is Large| D[Build Image Pyramid]
    B --> |Image is Small| Z[Compose RGB Image]

    %% Image Pyramid Loop
    D --> |Downscale to Next Level| F[Grid Search / Score Matching]
    F --> |Compute Best Displacement Vector at This Scale| G[Store Displacement & Scale Up]
    G --> |Move to Finer Scale| D

    %% Exit Condition
    D --> |Reached Finest Scale| H[Apply Final Displacement]
    H --> Z[Compose RGB Image]
