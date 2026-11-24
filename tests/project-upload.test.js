import test from 'node:test';
import assert from 'node:assert/strict';
import { uploadProjectFiles, applyCoverIfUnchanged } from '../src/utils/projectUpload.js';

test('uploadProjectFiles awaits real URLs and maps attachments', async () => {
  const uploadedCalls = [];
  const fakeUploader = async (file, resourceType) => {
    uploadedCalls.push({ file, resourceType });
    return `https://res.cloudinary.com/gitm/upload/${file.name}`;
  };

  const files = [
    { name: 'diagram.png', size: 2048, type: 'image/png' },
    { name: 'specs.pdf', size: 10240, type: 'application/pdf' },
  ];

  const result = await uploadProjectFiles({
    files,
    currentCoverImage: '',
    uploader: fakeUploader,
  });

  assert.equal(uploadedCalls.length, 2);
  assert.equal(uploadedCalls[0].resourceType, 'image');
  assert.equal(uploadedCalls[1].resourceType, 'auto');

  assert.deepEqual(result.attachments, [
    {
      name: 'diagram.png',
      url: 'https://res.cloudinary.com/gitm/upload/diagram.png',
      size: '2.0 KB',
      type: 'image/png',
    },
    {
      name: 'specs.pdf',
      url: 'https://res.cloudinary.com/gitm/upload/specs.pdf',
      size: '10.0 KB',
      type: 'application/pdf',
    },
  ]);
});

test('uploadProjectFiles sets cover if absent from first image', async () => {
  const fakeUploader = async (file) => `https://res.cloudinary.com/gitm/${file.name}`;

  const files = [
    { name: 'code.zip', size: 5000, type: 'application/zip' },
    { name: 'cover-candidate.jpg', size: 4096, type: 'image/jpeg' },
    { name: 'extra.jpg', size: 4096, type: 'image/jpeg' },
  ];

  const result = await uploadProjectFiles({
    files,
    currentCoverImage: '',
    uploader: fakeUploader,
  });

  assert.equal(result.coverImage, 'https://res.cloudinary.com/gitm/cover-candidate.jpg');
});

test('uploadProjectFiles preserves existing cover when present', async () => {
  const existingCover = 'https://res.cloudinary.com/gitm/existing.png';
  const fakeUploader = async (file) => `https://res.cloudinary.com/gitm/${file.name}`;

  const files = [
    { name: 'new.png', size: 2048, type: 'image/png' },
  ];

  const result = await uploadProjectFiles({
    files,
    currentCoverImage: existingCover,
    uploader: fakeUploader,
  });

  assert.equal(result.coverImage, existingCover);
});

test('uploadProjectFiles propagates upload errors for error state handling', async () => {
  const failingUploader = async () => {
    throw new Error('Cloudinary quota exceeded');
  };

  const files = [{ name: 'fail.png', size: 1000, type: 'image/png' }];

  await assert.rejects(
    () => uploadProjectFiles({ files, uploader: failingUploader }),
    { message: 'Cloudinary quota exceeded' }
  );
});

test('uploadProjectFiles validates uploader return URL', async () => {
  const invalidUploader = async () => null;
  const files = [{ name: 'empty.png', size: 1000, type: 'image/png' }];

  await assert.rejects(
    () => uploadProjectFiles({ files, uploader: invalidUploader }),
    /invalid URL returned/
  );
});

test('applyCoverIfUnchanged replaces starting cover if unchanged during await', () => {
  const starting = 'https://gitm.ma/old.png';
  const prevDuringAwait = 'https://gitm.ma/old.png';
  const uploadedUrl = 'https://cloudinary.com/new.png';

  const result = applyCoverIfUnchanged(prevDuringAwait, starting, uploadedUrl);
  assert.equal(result, uploadedUrl);
});

test('applyCoverIfUnchanged retains manual URL typed during await', () => {
  const starting = '';
  const manuallyTypedDuringAwait = 'https://user-typed.com/custom.png';
  const uploadedUrl = 'https://cloudinary.com/uploaded.png';

  const result = applyCoverIfUnchanged(manuallyTypedDuringAwait, starting, uploadedUrl);
  assert.equal(result, manuallyTypedDuringAwait, 'must retain edits made during await');
});

test('applyCoverIfUnchanged retains user edits when starting cover was non-empty', () => {
  const starting = 'https://gitm.ma/initial.png';
  const editedDuringAwait = 'https://gitm.ma/user-edited.png';
  const uploadedUrl = 'https://cloudinary.com/uploaded.png';

  const result = applyCoverIfUnchanged(editedDuringAwait, starting, uploadedUrl);
  assert.equal(result, editedDuringAwait, 'must retain edits when starting cover changed');
});
