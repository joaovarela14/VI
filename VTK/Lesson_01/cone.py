###############################################################################
#       						Cone.py
###############################################################################

# This example creates a polygonal model of a Cone e visualize the results in a
# VTK render window.
# The program creates the cone, rotates it 360º and closes
# The pipeline  source -> mapper -> actor -> renderer  is typical 
# and can be found in most VTK programs

# Imports

# Import all VTK modules
from vtkmodules.all import *

def main():

    coneSource = vtkConeSource()
    coneSource.SetHeight(2)          # altura do cone
    coneSource.SetRadius(1)          # raio do cone
    coneSource.SetResolution(100)    # resolução do cone
    
    coneMapper = vtkPolyDataMapper()
    coneMapper.SetInputConnection(coneSource.GetOutputPort())
  
    coneActor = vtkActor()
    coneActor.SetMapper(coneMapper)


    # Esfera

    sphereSource = vtkSphereSource()     # fonte da esfera
    sphereSource.SetRadius(2)            # raio = 2
    sphereSource.SetPhiResolution(100)   # resolução vertical
    sphereSource.SetThetaResolution(100) # resolução horizontal

    sphereMapper = vtkPolyDataMapper()
    sphereMapper.SetInputConnection(sphereSource.GetOutputPort())

    sphereActor = vtkActor()
    sphereActor.SetMapper(sphereMapper)

    # Cilindro
    
    cylinderSource = vtkCylinderSource()  # fonte do cilindro
    cylinderSource.SetRadius(2)           # raio = 2
    cylinderSource.SetHeight(3)           # altura = 3
    cylinderSource.SetResolution(100)     # resolução lateral

    cylinderMapper = vtkPolyDataMapper()
    cylinderMapper.SetInputConnection(cylinderSource.GetOutputPort())

    cylinderActor = vtkActor()
    cylinderActor.SetMapper(cylinderMapper)


    ren = vtkRenderer()
    ren.SetBackground(1,1,1)
    # ren.AddActor(coneActor)
    # ren.AddActor(sphereActor)
    ren.AddActor(cylinderActor)
    

    renWin = vtkRenderWindow()
    renWin.AddRenderer(ren)
    renWin.SetSize(300,300)                  # tamanho original 300x300
    renWin.SetWindowName('Lesson 1')

    for i in range(0,1360):
        renWin.Render()
        ren.GetActiveCamera().Azimuth(1)

if __name__ == '__main__':
    main()
