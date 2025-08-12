// import * as FileSystem from 'expo-file-system';
// import * as Updates from 'expo-updates';

// const clearAppCache = async () => {
//   try {
//     // Clear update cache
//     await Updates.reloadAsync();
//     console.log('Update cache cleared');

//     // Clear image/cache files
//     const cacheDir = FileSystem.cacheDirectory;
//     const files = await FileSystem.readDirectoryAsync(cacheDir);
//     const imageCacheFiles = files.filter(file => file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.cache'));
//     await Promise.all(imageCacheFiles.map(file => FileSystem.deleteAsync(`${cacheDir}${file}`, { idempotent: true })));
//     console.log('Image and cache files cleared successfully');
//   } catch (error) {
//     console.error('Error clearing cache:', error.message);
//   }
// };

// export default clearAppCache;