#!/usr/bin/env python3
import os

# Check prompts.py for null bytes
prompts_path = 'backend/app/prompts/prompts.py'
print(f'Checking {prompts_path}...')

if os.path.exists(prompts_path):
    with open(prompts_path, 'rb') as f:
        content = f.read()
    
    print(f'File size: {len(content)} bytes')
    null_count = sum(1 for b in content if b == 0)
    print(f'Null bytes: {null_count}')
    
    if null_count > 0:
        print('\nNull byte positions:')
        positions = [i for i, b in enumerate(content) if b == 0]
        for i, pos in enumerate(positions[:10]):
            print(f'  {i}: {pos}')
        
        # Try to restore from git
        print('\nAttempting git checkout...')
        os.system('git checkout backend/app/prompts/prompts.py')
        
        # Check if restored
        with open(prompts_path, 'rb') as f:
            content2 = f.read()
        print(f'After checkout - Null bytes: {sum(1 for b in content2 if b == 0)}')
    else:
        print('File is clean, no null bytes found')
else:
    print('File not found')
