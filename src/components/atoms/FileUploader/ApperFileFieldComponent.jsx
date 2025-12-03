import React, { useState, useRef, useEffect, useMemo } from 'react';

const ApperFileFieldComponent = ({ elementId, config }) => {
  // State for UI-driven values
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  
  // Refs for tracking lifecycle and preventing memory leaks
  const mountedRef = useRef(false);
  const elementIdRef = useRef(elementId);
  const existingFilesRef = useRef([]);

  // Update elementId ref when it changes
  useEffect(() => {
    elementIdRef.current = elementId;
  }, [elementId]);

  // Memoize existingFiles to prevent unnecessary re-renders
  const memoizedExistingFiles = useMemo(() => {
    if (!config.existingFiles || !Array.isArray(config.existingFiles)) {
      return [];
    }
    
    // Return empty array if no files to prevent unnecessary operations
    if (config.existingFiles.length === 0) {
      return [];
    }
    
    // Check if files have actually changed by comparing length and first file ID
    const currentLength = config.existingFiles.length;
    const previousLength = existingFilesRef.current.length;
    
    if (currentLength !== previousLength) {
      return config.existingFiles;
    }
    
    // If same length, check first file's ID to detect changes
    if (currentLength > 0) {
      const currentFirstId = config.existingFiles[0]?.Id || config.existingFiles[0]?.id;
      const previousFirstId = existingFilesRef.current[0]?.Id || existingFilesRef.current[0]?.id;
      
      if (currentFirstId !== previousFirstId) {
        return config.existingFiles;
      }
    }
    
    // Return previous reference if no changes detected
    return existingFilesRef.current;
  }, [config.existingFiles]);

  // Initial Mount Effect (elementId, config.existingFiles)
  useEffect(() => {
    let isMounted = true;
    
    const initializeSDK = async () => {
      try {
        // Initialize ApperSDK: 50 attempts × 100ms, throw error if timeout
        let attempts = 0;
        const maxAttempts = 50;
        
        while (attempts < maxAttempts) {
          if (window.ApperSDK && window.ApperSDK.ApperFileUploader) {
            break;
          }
          
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        
        if (!window.ApperSDK || !window.ApperSDK.ApperFileUploader) {
          throw new Error('ApperSDK not loaded. Please ensure the SDK script is included before this component.');
        }
        
        const { ApperFileUploader } = window.ApperSDK;
        
        if (!isMounted) return;
        
        // Mount the file field with full config including existingFiles
        elementIdRef.current = `file-uploader-${elementId}`;
        
        await ApperFileUploader.FileField.mount(elementIdRef.current, {
          ...config,
          existingFiles: memoizedExistingFiles
        });
        
        if (isMounted) {
          mountedRef.current = true;
          existingFilesRef.current = memoizedExistingFiles;
          setIsReady(true);
          setError(null);
        }
        
      } catch (error) {
        console.error('File field mount error:', error);
        if (isMounted) {
          setError(error.message);
          setIsReady(false);
        }
      }
    };
    
    initializeSDK();
    
    // Cleanup on component destruction
    return () => {
      isMounted = false;
      try {
        if (mountedRef.current && window.ApperSDK && window.ApperSDK.ApperFileUploader) {
          window.ApperSDK.ApperFileUploader.FileField.unmount(elementIdRef.current);
        }
        mountedRef.current = false;
        existingFilesRef.current = [];
      } catch (error) {
        console.error('File field unmount error:', error);
      }
    };
  }, [elementId, config.fieldName, config.tableName, config.apperProjectId, config.apperPublicKey]);

  // File Update Effect (existingFiles, isReady, config.fieldKey)
  useEffect(() => {
    // Early returns: check isReady, SDK, fieldKey
    if (!isReady || !window.ApperSDK || !config.fieldKey) {
      return;
    }
    
    try {
      const { ApperFileUploader } = window.ApperSDK;
      
      // Deep equality check with JSON.stringify between existingFiles and existingFilesRef
      const currentFilesStr = JSON.stringify(memoizedExistingFiles);
      const previousFilesStr = JSON.stringify(existingFilesRef.current);
      
      if (currentFilesStr === previousFilesStr) {
        return; // No changes detected
      }
      
      // Format detection: check for .Id vs .id property
      let filesToUpdate = memoizedExistingFiles;
      
      if (memoizedExistingFiles.length > 0) {
        const firstFile = memoizedExistingFiles[0];
        
        // Convert format if needed using toUIFormat()
        if (firstFile.Id !== undefined) {
          // API format detected, convert to UI format
          filesToUpdate = ApperFileUploader.toUIFormat(memoizedExistingFiles);
        }
      }
      
      // Conditional: updateFiles if length > 0, clearField if empty
      if (filesToUpdate.length > 0) {
        ApperFileUploader.FileField.updateFiles(config.fieldKey, filesToUpdate);
      } else {
        ApperFileUploader.FileField.clearField(config.fieldKey);
      }
      
      // Update the reference
      existingFilesRef.current = memoizedExistingFiles;
      
    } catch (error) {
      console.error('File field update error:', error);
      setError(error.message);
    }
  }, [memoizedExistingFiles, isReady, config.fieldKey]);

  // Error UI: Show if error state exists
  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-md bg-red-50">
        <p className="text-red-600 text-sm">File upload error: {error}</p>
      </div>
    );
  }

  return (
    <div className="file-upload-container">
      {/* Main container: Always render with unique ID */}
      <div id={`file-uploader-${elementId}`} className="min-h-[100px]">
        {/* Loading UI: Show when !isReady */}
        {!isReady && (
          <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Initializing file upload...</p>
            </div>
          </div>
        )}
        {/* Mounted: SDK takes over container */}
      </div>
    </div>
  );
};

export default ApperFileFieldComponent;