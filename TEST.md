# Testing Framework Documentation

The fractal generator includes a comprehensive testing infrastructure using Mocha and Chai.

## Test Structure

### Core Testing Framework

- Mocha/Chai environment configured with recursive test discovery
- Helper utilities in `test/utils/` for common testing needs
- Code coverage via c8 with HTML and lcov reporting
- CI/CD configurations for automated test runs

### Unit Tests (`test/unit/`)

- Parameter validation for fractal generation options
- Core mathematical functions and utilities
- Data processing and validation logic
- Error handling and logging functionality

### Integration Tests (`test/integration/`) 

- WebSocket API endpoint testing
- REST API functionality validation
- Canvas rendering and visualization tests
- System performance benchmarking

### Performance Tests (`test/performance/`)

- Memory consumption monitoring
- Animation frame rate analysis
- Large dataset processing tests
- Color mapping and rendering validation

## Test Commands
